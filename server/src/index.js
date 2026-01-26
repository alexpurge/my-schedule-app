import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { OAuth2Client, JWT } from "google-auth-library";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("APIFY_API_KEY loaded:", Boolean(process.env.APIFY_API_KEY));

const app = express();
const diagnosticsEnabled = process.env.DIAGNOSTICS === "true";

const googleClientId =
  process.env.GOOGLE_CLIENT_ID ||
  process.env.VITE_GOOGLE_CLIENT_ID;
const allowedEmails = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

const authClient = new OAuth2Client(googleClientId);
const sessions = new Map();
const SESSION_COOKIE = "schedule_session";

const diagLog = (message, details) => {
  if (!diagnosticsEnabled) return;
  if (details === undefined) {
    console.log(`[diagnostics] ${message}`);
    return;
  }
  console.log(`[diagnostics] ${message}`, details);
};

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const isEmailAllowed = (email) => {
  if (!allowedEmails.length) return true;
  const normalized = String(email || "").toLowerCase();
  return allowedEmails.some((entry) => {
    if (entry.startsWith("@")) {
      return normalized.endsWith(entry);
    }
    return normalized === entry;
  });
};

const getSession = (req) => {
  const sessionId = req.cookies?.[SESSION_COOKIE];
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
};

app.get("/auth/me", (req, res) => {
  const session = getSession(req);
  if (!session) {
    res.json({ authenticated: false });
    return;
  }
  res.json({ authenticated: true, email: session.email, name: session.name });
});

app.post("/auth/login", async (req, res) => {
  const { credential } = req.body || {};
  if (!credential) {
    res.status(400).json({ error: "Missing Google credential." });
    return;
  }
  if (!googleClientId) {
    res.status(500).json({
      error:
        "Server missing Google client ID. Set GOOGLE_CLIENT_ID (preferred) or VITE_GOOGLE_CLIENT_ID in the server environment.",
    });
    return;
  }
  try {
    const ticket = await authClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || payload?.given_name || email;
    if (!email) {
      res.status(400).json({ error: "Google account missing email." });
      return;
    }
    if (!isEmailAllowed(email)) {
      res.status(403).json({ error: "This account is not authorized." });
      return;
    }
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { email, name, createdAt: Date.now() });
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.json({ ok: true, email, name });
  } catch (error) {
    console.error("Google auth error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    res.status(401).json({
      error: `Invalid Google credential. ${detail}`,
    });
  }
});

app.post("/auth/logout", (req, res) => {
  const sessionId = req.cookies?.[SESSION_COOKIE];
  if (sessionId) {
    sessions.delete(sessionId);
  }
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ ok: true });
});

const publicPaths = new Set(["/health", "/auth/me", "/auth/login", "/auth/logout"]);
app.use((req, res, next) => {
  if (req.method === "OPTIONS" || publicPaths.has(req.path)) {
    next();
    return;
  }
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }
  req.user = session;
  next();
});

const getGoogleAuth = (scopes) => {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!clientEmail || !privateKey) return null;
  if (privateKey.includes("\\n")) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }
  return new JWT({
    email: clientEmail,
    key: privateKey,
    scopes,
  });
};

const getSheetsAuth = () => getGoogleAuth(["https://www.googleapis.com/auth/spreadsheets"]);
const getDriveAuth = () =>
  getGoogleAuth(["https://www.googleapis.com/auth/drive.metadata.readonly"]);

const getAccessTokenFromRequest = (req) => {
  const header = req.headers?.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
};

const getAuthDiagnostics = (req) => {
  const accessToken = getAccessTokenFromRequest(req);
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const hasServiceAccount = Boolean(clientEmail && privateKey);
  const authPath = accessToken ? "user_access_token" : hasServiceAccount ? "service_account" : "none";
  return {
    accessToken,
    authPath,
    authInputs: {
      accessTokenPresent: Boolean(accessToken),
      serviceAccountEmailPresent: Boolean(clientEmail),
      serviceAccountKeyPresent: Boolean(privateKey),
    },
  };
};

const getAuthHeaders = async (accessToken, fallbackAuth) => {
  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` };
  }
  const auth = fallbackAuth();
  if (!auth) return null;
  return auth.getRequestHeaders();
};

const buildSheetsUrl = (spreadsheetId, path, query) => {
  const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`);
  if (query && typeof query === "object") {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }
  return url;
};

const requestGoogleApi = async ({ apiMethod, url, method = "GET", headers, body }) => {
  diagLog(`google api call: ${apiMethod}`);
  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const contentType = res.headers.get("content-type") || "";
    let payload = null;
    if (contentType.includes("application/json")) {
      payload = await res.json().catch(() => null);
    } else {
      payload = await res.text().catch(() => null);
    }
    if (!res.ok) {
      diagLog(`google api error: ${apiMethod}`, {
        status: res.status,
        message: res.statusText,
        responseData: payload,
      });
    }
    return { ok: res.ok, status: res.status, data: payload };
  } catch (error) {
    diagLog(`google api exception: ${apiMethod}`, {
      status: error?.response?.status,
      message: error instanceof Error ? error.message : "Unknown error",
      responseData: error?.response?.data,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      ok: false,
      status: error?.response?.status || 500,
      data: error?.response?.data || { error: "Google API request failed." },
    };
  }
};

const requestSheetsApi = async ({ spreadsheetId, path, method = "GET", query, body, accessToken, apiMethod }) => {
  const headers = await getAuthHeaders(accessToken, getSheetsAuth);
  if (!headers) {
    return { ok: false, status: 500, data: { error: "Sheets API is not configured for this server or user." } };
  }
  const url = buildSheetsUrl(spreadsheetId, path, query);
  return requestGoogleApi({
    apiMethod,
    url,
    method,
    headers,
    body,
  });
};

const ensureSheetExists = async (spreadsheetId, sheetTitle, accessToken) => {
  const meta = await requestSheetsApi({
    spreadsheetId,
    path: "",
    query: { fields: "sheets.properties" },
    accessToken,
    apiMethod: "sheets.spreadsheets.get",
  });
  if (!meta.ok) return meta;
  const sheets = meta.data?.sheets || [];
  const exists = sheets.find((sheet) => sheet?.properties?.title === sheetTitle);
  if (exists) return meta;
  return requestSheetsApi({
    spreadsheetId,
    path: ":batchUpdate",
    method: "POST",
    body: {
      requests: [{ addSheet: { properties: { title: sheetTitle } } }],
    },
    accessToken,
    apiMethod: "sheets.spreadsheets.batchUpdate",
  });
};

const normalizeRows = (headers, rows) =>
  rows.map((row) => headers.map((header) => (row && row[header] !== undefined ? row[header] : "")));

app.get("/sheets/status", (req, res) => {
  diagLog("route entry: GET /sheets/status");
  const accessToken = getAccessTokenFromRequest(req);
  const diagnostics = getAuthDiagnostics(req);
  diagLog("auth path", diagnostics.authPath);
  diagLog("auth inputs present", diagnostics.authInputs);
  if (accessToken) {
    res.json({
      configured: true,
      mode: "user",
      accountEmail: req.user?.email || null,
      serviceAccountEmail: null,
    });
    return;
  }
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  res.json({
    configured: Boolean(clientEmail && privateKey),
    mode: clientEmail && privateKey ? "service_account" : "none",
    accountEmail: null,
    serviceAccountEmail: clientEmail || null,
  });
});

app.get("/sheets/recent", (req, res) => {
  diagLog("route entry: GET /sheets/recent");
  const diagnostics = getAuthDiagnostics(req);
  diagLog("auth path", diagnostics.authPath);
  diagLog("auth inputs present", diagnostics.authInputs);
  res.json({
    files: [],
    disabled: true,
    message: "Recent sheets lookup requires Google Drive API access and is disabled.",
  });
});

app.post("/sheets/sync", async (req, res) => {
  diagLog("route entry: POST /sheets/sync");
  const { spreadsheetId, sheetTitle, headers, rows, mode } = req.body || {};
  if (!spreadsheetId || !sheetTitle || !Array.isArray(headers) || !Array.isArray(rows)) {
    res.status(400).json({ error: "Missing spreadsheetId, sheetTitle, headers, or rows." });
    return;
  }

  try {
    const diagnostics = getAuthDiagnostics(req);
    diagLog("auth path", diagnostics.authPath);
    diagLog("auth inputs present", diagnostics.authInputs);
    const accessToken = diagnostics.accessToken;
    const ensureRes = await ensureSheetExists(spreadsheetId, sheetTitle, accessToken);
    if (!ensureRes.ok) {
      res.status(ensureRes.status).json(ensureRes.data || { error: "Unable to access spreadsheet." });
      return;
    }

    const values = normalizeRows(headers, rows);
    const range = encodeURIComponent(`${sheetTitle}!A1`);

    if (mode === "overwrite") {
      await requestSheetsApi({
        spreadsheetId,
        path: `/values/${range}:clear`,
        method: "POST",
        accessToken,
        apiMethod: "sheets.spreadsheets.values.clear",
      });

      const payloadValues = [headers, ...values];
      const updateRes = await requestSheetsApi({
        spreadsheetId,
        path: `/values/${range}`,
        method: "PUT",
        query: { valueInputOption: "RAW" },
        body: { values: payloadValues },
        accessToken,
        apiMethod: "sheets.spreadsheets.values.update",
      });
      res.status(updateRes.ok ? 200 : updateRes.status).json({
        ok: updateRes.ok,
        rows: values.length,
      });
      return;
    }

    const headerCheck = await requestSheetsApi({
      spreadsheetId,
      path: `/values/${range}`,
      query: { majorDimension: "ROWS" },
      accessToken,
      apiMethod: "sheets.spreadsheets.values.get",
    });
    const hasHeader = Array.isArray(headerCheck.data?.values) && headerCheck.data.values.length > 0;
    const payloadValues = hasHeader ? values : [headers, ...values];

    if (!payloadValues.length) {
      res.json({ ok: true, rows: 0 });
      return;
    }

    const appendRes = await requestSheetsApi({
      spreadsheetId,
      path: `/values/${range}:append`,
      method: "POST",
      query: { valueInputOption: "RAW", insertDataOption: "INSERT_ROWS" },
      body: { values: payloadValues },
      accessToken,
      apiMethod: "sheets.spreadsheets.values.append",
    });

    res.status(appendRes.ok ? 200 : appendRes.status).json({
      ok: appendRes.ok,
      rows: values.length,
    });
  } catch (error) {
    console.error("Sheets sync failed:", error);
    res.status(500).json({ error: "Sheets sync failed." });
  }
});

app.post("/sheets/read", async (req, res) => {
  diagLog("route entry: POST /sheets/read");
  const { spreadsheetId, sheetTitle } = req.body || {};
  if (!spreadsheetId || !sheetTitle) {
    res.status(400).json({ error: "Missing spreadsheetId or sheetTitle." });
    return;
  }

  try {
    const diagnostics = getAuthDiagnostics(req);
    diagLog("auth path", diagnostics.authPath);
    diagLog("auth inputs present", diagnostics.authInputs);
    const accessToken = diagnostics.accessToken;
    const range = encodeURIComponent(sheetTitle);
    const readRes = await requestSheetsApi({
      spreadsheetId,
      path: `/values/${range}`,
      query: { majorDimension: "ROWS" },
      accessToken,
      apiMethod: "sheets.spreadsheets.values.get",
    });

    if (!readRes.ok) {
      res.status(readRes.status).json(readRes.data || { error: "Unable to read sheet data." });
      return;
    }

    const values = Array.isArray(readRes.data?.values) ? readRes.data.values : [];
    if (!values.length) {
      res.json({ headers: [], rows: [] });
      return;
    }
    const [headers, ...dataRows] = values;
    const rows = dataRows.map((row) => {
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header] = row?.[idx] ?? "";
      });
      return obj;
    });
    res.json({ headers, rows });
  } catch (error) {
    console.error("Sheets read failed:", error);
    res.status(500).json({ error: "Sheets read failed." });
  }
});

app.get("/debug/google", async (req, res) => {
  diagLog("route entry: GET /debug/google");
  const diagnostics = getAuthDiagnostics(req);
  diagLog("auth path", diagnostics.authPath);
  diagLog("auth inputs present", diagnostics.authInputs);

  const spreadsheetId = process.env.DIAGNOSTICS_SHEET_ID;
  const accessToken = diagnostics.accessToken;
  let response = null;
  let apiMethod = "";

  if (spreadsheetId) {
    apiMethod = "sheets.spreadsheets.get";
    const url = buildSheetsUrl(spreadsheetId, "", { fields: "properties.title" });
    const headers = await getAuthHeaders(accessToken, getSheetsAuth);
    if (!headers) {
      res.status(500).json({
        ok: false,
        authPath: diagnostics.authPath,
        tokenPresent: Boolean(accessToken),
        scopes: null,
        error: { status: 500, message: "Sheets API is not configured for this server or user." },
      });
      return;
    }
    response = await requestGoogleApi({ apiMethod, url, headers });
  } else {
    apiMethod = "drive.about.get";
    const headers = await getAuthHeaders(accessToken, getDriveAuth);
    if (!headers) {
      res.status(500).json({
        ok: false,
        authPath: diagnostics.authPath,
        tokenPresent: Boolean(accessToken),
        scopes: null,
        error: { status: 500, message: "Drive API is not configured for this server or user." },
      });
      return;
    }
    const url = new URL("https://www.googleapis.com/drive/v3/about");
    url.searchParams.set("fields", "user,storageQuota");
    response = await requestGoogleApi({ apiMethod, url, headers });
  }

  res.status(response.ok ? 200 : response.status).json({
    ok: response.ok,
    authPath: diagnostics.authPath,
    tokenPresent: Boolean(accessToken),
    scopes: null,
    error: response.ok
      ? null
      : {
          status: response.status,
          message: response.data?.error?.message || "Google API request failed.",
          responseData: response.data,
        },
  });
});

app.get("/apify/token", (req, res) => {
  const token = process.env.APIFY_API_KEY;
  if (!token) {
    res.status(500).send("Apify token is not configured on the server.");
    return;
  }
  res.json({ configured: true });
});

const getApifyToken = () => process.env.APIFY_API_KEY;

const logMissingApifyToken = () => {
  console.error("Missing APIFY_API_KEY");
};

app.post("/apify/request", async (req, res) => {
  const { path: apifyPath, method, query, body } = req.body || {};
  if (!apifyPath || typeof apifyPath !== "string") {
    res.status(400).json({ error: "Missing Apify path." });
    return;
  }

  const token = getApifyToken();
  if (!token) {
    logMissingApifyToken();
    res.status(500).send("Apify token is not configured on the server.");
    return;
  }

  try {
    const url = new URL(`https://api.apify.com${apifyPath}`);
    url.searchParams.set("token", token);

    if (query && typeof query === "object") {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        url.searchParams.set(key, String(value));
      });
    }

    const options = {
      method: (method || "GET").toUpperCase(),
      headers: {},
    };

    if (body !== undefined && body !== null) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const apifyRes = await fetch(url, options);
    const contentType = apifyRes.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }
    const text = await apifyRes.text();
    res.status(apifyRes.status).send(text);
  } catch (error) {
    console.error("Apify request failed:", error);
    res.status(500).json({ error: "Apify request failed." });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("APIFY_API_KEY loaded:", Boolean(process.env.APIFY_API_KEY));

const app = express();

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
  if (!allowedEmails.length) return false;
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
  res.json({ authenticated: true, email: session.email });
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
    if (!email) {
      res.status(400).json({ error: "Google account missing email." });
      return;
    }
    if (!isEmailAllowed(email)) {
      res.status(403).json({ error: "This account is not authorized." });
      return;
    }
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { email, createdAt: Date.now() });
    res.cookie(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.json({ ok: true, email });
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

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
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const app = express();

const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID;
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
    res.status(500).json({ error: "Server missing Google client ID." });
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
    res.status(401).json({ error: "Invalid Google credential." });
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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server running on http://localhost:" + port);
});

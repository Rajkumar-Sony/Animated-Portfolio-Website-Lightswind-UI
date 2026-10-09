/**
 * Shared environment/config for the portfolio's Vercel serverless functions.
 *
 * Env (set in the Vercel project settings, see .env.example):
 *   ZOHO_MAIL_USER           your Zoho address, e.g. rajkumar.sony@zohomail.in
 *   ZOHO_MAIL_APP_PASSWORD   app password from Zoho Mail → Security → App Passwords
 *   RESUME_OWNER_EMAIL       who gets notified (defaults to ZOHO_MAIL_USER)
 *   RESUME_SERVER_PUBLIC_URL base URL used in approval links (default https://rajkumarsony.vercel.app)
 *   APPROVAL_TOKEN_SECRET    HMAC secret signing approve/reject tokens (required in production)
 *   RESUME_PUBLIC_URL        public resume link included in the sent resume email
 *   ALLOWED_ORIGINS          comma-separated CORS allowlist (defaults cover prod + local dev)
 *
 * Without ZOHO_MAIL_APP_PASSWORD the functions run in MOCK mode: outgoing mail is
 * printed to the function logs instead of sent, so the flow can be tested safely.
 */

import { randomBytes } from "node:crypto";

export const ZOHO_USER = process.env.ZOHO_MAIL_USER || "";
/** Zoho shows grouped passwords; SMTP expects continuous characters without spaces. */
export const ZOHO_PASSWORD = (process.env.ZOHO_MAIL_APP_PASSWORD || "").replace(/\s+/g, "");
export const OWNER_EMAIL = process.env.RESUME_OWNER_EMAIL || ZOHO_USER;
export const MOCK = !ZOHO_PASSWORD || !ZOHO_USER;

export const PUBLIC_URL = (
  process.env.RESUME_SERVER_PUBLIC_URL ||
  "https://rajkumarsony.vercel.app"
).replace(/\/$/, "");

export const RESUME_PUBLIC_URL =
  process.env.RESUME_PUBLIC_URL || "https://app.box.com/s/5c4liqe7jpyb2gwqpd3oyvtusryndxnq";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Approve/reject links expire after this duration (default 7 days). */
export const TOKEN_MAX_AGE_MS = Number(process.env.TOKEN_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000);

/** HMAC secret for stateless approval tokens. Never commit a real value. */
export const TOKEN_SECRET = process.env.APPROVAL_TOKEN_SECRET || "";

/** Fails closed: if no secret is configured, tokens cannot be minted or trusted. */
export const TOKENS_ENABLED = TOKEN_SECRET.length >= 16;

/** Generate a strong secret (used when setting up the project). */
export function generateTokenSecret() {
  return randomBytes(32).toString("base64url");
}

const DEFAULT_ORIGINS = [
  "https://rajkumarsony.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(","))
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean),
);

/** Echo the request origin back only when it is allowlisted (same-origin needs no CORS). */
export function corsOrigin(origin) {
  return origin && ALLOWED_ORIGINS.has(origin.replace(/\/$/, "")) ? origin : null;
}

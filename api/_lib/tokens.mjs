/**
 * Stateless approval tokens — the serverless replacement for the old in-memory
 * `pending` Map (which cannot survive across serverless invocations).
 *
 * A token is:  <base64url(email)>.<base64url(issuedAtMs)>.<base64url(HMAC-SHA256)>
 *
 * Approve/reject links carry the requester email inside the token itself, signed
 * with APPROVAL_TOKEN_SECRET. Anyone can *read* the email by decoding the token,
 * but only the owner ever receives the link and it cannot be forged or mutated.
 *
 * Env is read lazily so the functions pick up runtime values and tests can
 * vary the secret/max age within one process.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { EMAIL_PATTERN } from "./config.mjs";

const DEFAULT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const b64url = (input) => Buffer.from(input).toString("base64url");
const fromB64url = (input) => Buffer.from(input, "base64url").toString("utf8");

const secret = () => process.env.APPROVAL_TOKEN_SECRET || "";
const maxAgeMs = () => Number(process.env.TOKEN_MAX_AGE_MS || DEFAULT_MAX_AGE_MS);
/** Fails closed: if no secret is configured, tokens cannot be minted or trusted. */
export const tokensEnabled = () => secret().length >= 16;

export function signApprovalToken(email) {
  if (!tokensEnabled()) throw new Error("APPROVAL_TOKEN_SECRET is not configured");
  const payload = `${b64url(email)}.${b64url(String(Date.now()))}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/**
 * Verify a token's signature and age. Returns the requester email, or null when
 * the token is malformed, forged, expired, or the secret is missing/mismatched.
 */
export function verifyApprovalToken(token) {
  if (!tokensEnabled() || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [emailB64, issuedAtB64, sig] = parts;
  const expected = createHmac("sha256", secret())
    .update(`${emailB64}.${issuedAtB64}`)
    .digest();

  let actual;
  try {
    actual = Buffer.from(sig, "base64url");
  } catch {
    return null;
  }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;

  let email;
  let issuedAt;
  try {
    email = fromB64url(emailB64);
    issuedAt = Number(fromB64url(issuedAtB64));
  } catch {
    return null;
  }
  if (!Number.isFinite(issuedAt) || !EMAIL_PATTERN.test(email)) return null;
  if (Date.now() - issuedAt > maxAgeMs()) return null;

  return email;
}

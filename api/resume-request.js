/**
 * POST /api/resume-request — visitor asked for the resume.
 * The owner gets an approval email with signed Approve/Reject links
 * (stateless HMAC tokens — no server-side storage needed on Vercel).
 */

import { readBody, json } from "./_lib/http.mjs";
import { sendMail } from "./_lib/mailer.mjs";
import {
  ZOHO_USER,
  ZOHO_PASSWORD,
  OWNER_EMAIL,
  MOCK,
  PUBLIC_URL,
  EMAIL_PATTERN,
  TOKENS_ENABLED,
} from "./_lib/config.mjs";
import { signApprovalToken } from "./_lib/tokens.mjs";
import { deriveNameFromEmail } from "../server/derive-name-from-email.mjs";

export const maxDuration = 15;

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed." }, req.headers.origin);
  }

  let email = "";
  try {
    ({ email = "" } = JSON.parse(await readBody(req)) || {});
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON body." }, req.headers.origin);
  }
  email = String(email).trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    return json(res, 422, { ok: false, error: "Please provide a valid email address." }, req.headers.origin);
  }
  if (!TOKENS_ENABLED) {
    console.error("[resume-request] APPROVAL_TOKEN_SECRET is missing — cannot mint approval links");
    return json(res, 500, { ok: false, error: "Server is misconfigured. Please try again later." }, req.headers.origin);
  }

  const requesterName = deriveNameFromEmail(email);
  const token = signApprovalToken(email);
  const approveUrl = `${PUBLIC_URL}/approve/${token}`;
  const rejectUrl = `${PUBLIC_URL}/reject/${token}`;

  const who = requesterName
    ? `<strong>${requesterName.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch])}</strong> (${email})`
    : `<strong>${email}</strong>`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
      <h2 style="margin:0 0 12px;font-size:18px">New resume request</h2>
      <p style="margin:0 0 4px">${who} requested your latest resume from your portfolio.</p>
      <p style="margin:16px 0 24px;color:#6b7280;font-size:13px">
        Approving sends your latest resume from Zoho Mail to their inbox (link + attachment when available).
      </p>
      <a href="${approveUrl}"
         style="display:inline-block;background:#111;color:#fff;padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:600;margin-right:10px">
        ✅ Approve &amp; send resume
      </a>
      <a href="${rejectUrl}"
         style="display:inline-block;border:1px solid #d1d5db;color:#374151;padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:600">
        Reject
      </a>
    </div>`;

  const mail = {
    from: `"Portfolio Resume Bot" <${ZOHO_USER}>`,
    to: OWNER_EMAIL,
    subject: requesterName
      ? `Resume request from ${requesterName} — needs your approval`
      : `Resume request from ${email} — needs your approval`,
    html,
  };

  try {
    if (MOCK) {
      console.log(`\n[MOCK] Approval email that would be sent to ${OWNER_EMAIL}:\n${html}\n`);
    } else {
      await sendMail(mail, { user: ZOHO_USER, password: ZOHO_PASSWORD, mock: MOCK });
    }
    const nameHint = requesterName ? ` (${requesterName})` : "";
    console.log(`[resume-request] request from ${email}${nameHint} → approval email ${MOCK ? "(mock — NOT sent to Zoho)" : "sent"} to ${OWNER_EMAIL}`);
    return json(res, 200, { ok: true, mock: MOCK }, req.headers.origin);
  } catch (error) {
    console.error("[resume-request] failed to notify owner:", error);
    return json(res, 502, { ok: false, error: "Could not forward your request. Please try again later." }, req.headers.origin);
  }
}

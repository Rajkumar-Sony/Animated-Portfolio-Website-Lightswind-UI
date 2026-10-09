/**
 * Resume request server.
 *
 * Flow:
 *  0. Visitor submits the contact form → POST /api/contact → the owner gets a
 *     notification email (reply-to = visitor) and the visitor gets a thank-you
 *     auto-reply promising a reply as soon as possible.
 *  1. Visitor submits their email in the portfolio popup  → POST /api/resume-request
 *  2. Owner (you) receives an approval email on Zoho Mail → sent via Zoho SMTP
 *     with "Approve" / "Reject" links.
 *  3. Clicking "Approve" (GET /approve/:token) emails the requester from Zoho
 *     with your latest resume link (RESUME_PUBLIC_URL, e.g. Box) and optionally
 *     a local PDF attachment if public/resume.pdf exists. "Reject" discards it.
 *
 * Env (see .env.local):
 *   ZOHO_MAIL_USER           your Zoho address, e.g. rajkumar.sony@zohomail.in
 *   ZOHO_MAIL_APP_PASSWORD   app password from Zoho Mail → Security → App Passwords
 *   RESUME_SERVER_PORT       port for this server (default 8787)
 *   RESUME_SERVER_PUBLIC_URL base URL used in approval links (default http://localhost:8787)
 *
 * Without ZOHO_MAIL_APP_PASSWORD the server runs in MOCK mode: outgoing mail is
 * printed to the console instead of sent, so the flow can be tested safely.
 */

import http from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import { deriveNameFromEmail } from "./derive-name-from-email.mjs";
import {
  RESUME_ATTACHMENT_FILENAME,
  buildApprovedResumeMail,
} from "./resume-request-email.mjs";
import { buildContactThanksMail, buildOwnerContactMail } from "./contact-email.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.RESUME_SERVER_PORT || 8787);
const PUBLIC_URL = (process.env.RESUME_SERVER_PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
const ZOHO_USER = process.env.ZOHO_MAIL_USER || "";
/** Zoho shows grouped passwords; SMTP expects continuous characters without spaces. */
const ZOHO_PASSWORD = (process.env.ZOHO_MAIL_APP_PASSWORD || "").replace(/\s+/g, "");
const OWNER_EMAIL = process.env.RESUME_OWNER_EMAIL || ZOHO_USER;
const MOCK = !ZOHO_PASSWORD || !ZOHO_USER;

const SMTP_HOST = "smtp.zoho.in";
const SMTP_PORT = 465;

const RESUME_PUBLIC_URL =
  process.env.RESUME_PUBLIC_URL || "https://app.box.com/s/5c4liqe7jpyb2gwqpd3oyvtusryndxnq";
const RESUME_PATH = path.join(__dirname, "..", "public", "resume.pdf");

/** email → { token, requestedAt } — pending requests awaiting approval. */
const pending = new Map();
/** token → { email, requestedAt } — requests already approved/rejected (audit). */
const processed = new Map();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createZohoTransporter() {
  const attempts = [
    { host: SMTP_HOST, port: SMTP_PORT, secure: true },
    { host: SMTP_HOST, port: 587, secure: false, requireTLS: true },
  ];
  for (const cfg of attempts) {
    const t = nodemailer.createTransport({
      ...cfg,
      pool: false,
      auth: { user: ZOHO_USER, pass: ZOHO_PASSWORD },
    });
    try {
      await t.verify();
      return t;
    } catch {
      /* try next */
    }
  }
  throw new Error("Zoho SMTP authentication failed");
}

let transporter = null;

async function getTransporter() {
  if (MOCK) return null;
  if (!transporter) transporter = await createZohoTransporter();
  return transporter;
}

/** Send mail, retrying once with a fresh transporter if the connection dropped.
 *  In MOCK mode nothing is sent — the mail is printed to the console instead. */
async function sendMailRetry(mail) {
  if (MOCK) {
    console.log(`\n[MOCK] Email → ${mail.to}\n  from: ${mail.from}\n  subject: ${mail.subject}\n  replyTo: ${mail.replyTo || "-"}\n  body:\n${mail.text}\n`);
    return;
  }
  const t = await getTransporter();
  try {
    return await t.sendMail(mail);
  } catch (error) {
    if (error.code === "ECONNECTION" || error.code === "ESTREAM" || /connection/i.test(error.message)) {
      transporter = null;
      const fresh = await getTransporter();
      return await fresh.sendMail(mail);
    }
    throw error;
  }
}

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

async function sendOwnerApprovalEmail(requesterEmail, token, requesterName) {
  const approveUrl = `${PUBLIC_URL}/approve/${token}`;
  const rejectUrl = `${PUBLIC_URL}/reject/${token}`;
  const who = requesterName
    ? `<strong>${escapeHtml(requesterName)}</strong> (${escapeHtml(requesterEmail)})`
    : `<strong>${escapeHtml(requesterEmail)}</strong>`;

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
      : `Resume request from ${requesterEmail} — needs your approval`,
    html,
  };

  if (MOCK) {
    console.log(`\n[MOCK] Approval email that would be sent to ${OWNER_EMAIL}:\n${html}\n`);
    return;
  }
  await sendMailRetry(mail);
}

function optionalLocalResumeAttachment() {
  if (!existsSync(RESUME_PATH)) return null;
  try {
    const content = readFileSync(RESUME_PATH);
    if (content.length < 512 || content.slice(0, 4).toString() !== "%PDF") return null;
    return { filename: RESUME_ATTACHMENT_FILENAME, content, contentType: "application/pdf" };
  } catch {
    return null;
  }
}

async function sendResumeToRequester(requesterEmail, requesterName) {
  const attachment = optionalLocalResumeAttachment();
  const link = RESUME_PUBLIC_URL;
  const { subject, text, html } = buildApprovedResumeMail({ resumeLink: link, requesterName });

  const mail = {
    from: `"Raj Kumar Sony" <${ZOHO_USER}>`,
    to: requesterEmail,
    subject,
    text,
    html,
    attachments: attachment ? [attachment] : [],
  };

  if (MOCK) {
    console.log(
      `\n[MOCK] Resume email → ${requesterEmail}\n  subject: ${subject}\n  attachment: ${attachment ? `${attachment.filename} (${attachment.content.length} bytes)` : "none"}\n`,
    );
    return;
  }
  await sendMailRetry(mail);
}

const page = (title, body, color = "#111827") => `<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="font-family:Arial,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f9fafb">
  <div style="text-align:center;padding:40px;border:1px solid #e5e7eb;border-radius:16px;background:#fff">
    <h1 style="color:${color};font-size:22px">${escapeHtml(title)}</h1>
    <p style="color:#6b7280">${body}</p>
  </div>
</body></html>`;

const json = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
};

const html = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 10_000) req.destroy();
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, PUBLIC_URL);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  // 0. Visitor submitted the contact form → thank the sender, notify the owner.
  if (req.method === "POST" && url.pathname === "/api/contact") {
    let payload = {};
    try {
      payload = JSON.parse(await readBody(req)) || {};
    } catch {
      return json(res, 400, { ok: false, error: "Invalid JSON body." });
    }

    const name = String(payload.name || "").trim().slice(0, 80);
    const email = String(payload.email || "").trim().toLowerCase();
    const message = String(payload.message || "").trim().slice(0, 5000);

    if (name.length < 2) return json(res, 422, { ok: false, error: "Please provide your name." });
    if (!EMAIL_PATTERN.test(email)) return json(res, 422, { ok: false, error: "Please provide a valid email address." });
    if (message.length < 10) return json(res, 422, { ok: false, error: "Please write a message of at least 10 characters." });

    try {
      // Owner notification: reply-to is the visitor, so "Reply" answers them directly.
      const owner = buildOwnerContactMail({ name, email, message });
      // Visitor auto-reply: warm thank-you with the "as soon as possible" promise.
      const thanks = buildContactThanksMail({ name, message });

      await sendMailRetry({
        from: `"Portfolio Contact Form" <${ZOHO_USER}>`,
        to: OWNER_EMAIL,
        replyTo: email,
        subject: owner.subject,
        text: owner.text,
        html: owner.html,
      });
      await sendMailRetry({
        from: `"Raj Kumar Sony" <${ZOHO_USER}>`,
        to: email,
        subject: thanks.subject,
        text: thanks.text,
        html: thanks.html,
      });

      console.log(
        `[resume-server] contact message from ${name} <${email}> → owner notified + thank-you sent to visitor ${MOCK ? "(mock — NOT sent to Zoho)" : ""}`,
      );
      return json(res, 200, { ok: true, mock: MOCK });
    } catch (error) {
      console.error("[resume-server] failed to deliver contact emails:", error);
      return json(res, 502, { ok: false, error: "Could not send your message. Please try again later." });
    }
  }

  // 1. Visitor requested the resume.
  if (req.method === "POST" && url.pathname === "/api/resume-request") {    let email = "";
    try {
      ({ email = "" } = JSON.parse(await readBody(req)) || {});
    } catch {
      return json(res, 400, { ok: false, error: "Invalid JSON body." });
    }
    email = String(email).trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      return json(res, 422, { ok: false, error: "Please provide a valid email address." });
    }

    const requesterName = deriveNameFromEmail(email);

    // Reuse the pending token if this visitor asked twice.
    let token = pending.get(email)?.token;
    if (!token) {
      token = randomBytes(24).toString("hex");
    }
    pending.set(email, { token, requestedAt: new Date(), requesterName });

    try {
      await sendOwnerApprovalEmail(email, token, requesterName);
      const nameHint = requesterName ? ` (${requesterName})` : "";
      console.log(`[resume-server] request from ${email}${nameHint} → approval email ${MOCK ? "(mock — NOT sent to Zoho)" : "sent"} to ${OWNER_EMAIL}`);
      return json(res, 200, { ok: true, mock: MOCK });
    } catch (error) {
      console.error("[resume-server] failed to notify owner:", error);
      return json(res, 502, { ok: false, error: "Could not forward your request. Please try again later." });
    }
  }

  // 2. Owner clicked Approve.
  const approveMatch = url.pathname.match(/^\/approve\/([a-f0-9]{48})$/);
  if (req.method === "GET" && approveMatch) {
    const token = approveMatch[1];
    const entry = [...pending.entries()].find(([, v]) => v.token === token);
    if (!entry) {
      return html(
        res,
        404,
        page("Request not found", "This link may have expired or was already handled."),
      );
    }
    const [email, meta] = entry;
    try {
      await sendResumeToRequester(email, meta.requesterName);
      pending.delete(email);
      processed.set(token, { email, action: "approved", at: new Date() });
      const sentTo = meta.requesterName ? `${meta.requesterName} (${email})` : email;
      console.log(`[resume-server] approved → resume sent to ${sentTo}`);
      return html(
        res,
        200,
        page(
          "Resume sent",
          `Your latest resume was emailed to ${escapeHtml(meta.requesterName || email)} from Zoho Mail.`,
          "#059669",
        ),
      );
    } catch (error) {
      console.error("[resume-server] failed to send resume:", error);
      return html(
        res,
        502,
        page("Could not send email", "Check ZOHO_MAIL_APP_PASSWORD and try again from Zoho Mail settings."),
      );
    }
  }

  // 3. Owner clicked Reject.
  const rejectMatch = url.pathname.match(/^\/reject\/([a-f0-9]{48})$/);
  if (req.method === "GET" && rejectMatch) {
    const token = rejectMatch[1];
    const entry = [...pending.entries()].find(([, v]) => v.token === token);
    if (!entry) {
      return html(
        res,
        404,
        page("Request not found", "This link may have expired or was already handled."),
      );
    }
    const [email] = entry;
    pending.delete(email);
    processed.set(token, { email, action: "rejected", at: new Date() });
    console.log(`[resume-server] rejected → ${email}`);
    return html(res, 200, page("Request rejected", `No email was sent to ${escapeHtml(email)}.`));
  }

  if (req.method === "GET" && url.pathname === "/health") {
    return json(res, 200, { ok: true, mock: MOCK, pending: pending.size });
  }

  json(res, 404, { ok: false, error: "Not found." });
});

async function verifySmtpOnStartup() {
  if (MOCK) {
    console.warn(
      "[resume-server] ⚠ ZOHO_MAIL_APP_PASSWORD is missing — approval emails are NOT sent to your inbox (console mock only).",
    );
    return;
  }
  try {
    transporter = await createZohoTransporter();
    console.log(`[resume-server] SMTP verified (${SMTP_HOST} as ${ZOHO_USER})`);
  } catch (error) {
    console.error("[resume-server] SMTP verification failed — fix ZOHO_MAIL_APP_PASSWORD or enable SMTP in Zoho Mail:", error.message);
  }
}

server.listen(PORT, () => {
  console.log(`[resume-server] listening on ${PUBLIC_URL}`);
  void verifySmtpOnStartup();
});

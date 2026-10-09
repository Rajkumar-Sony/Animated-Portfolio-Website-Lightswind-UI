/**
 * POST /api/contact — visitor submitted the contact form.
 * The owner gets a notification email (reply-to = visitor) and the visitor
 * gets a thank-you auto-reply. Ported from server/resume-server.mjs.
 */

import { escapeHtml } from "./_lib/http.mjs";
import { readBody, json } from "./_lib/http.mjs";
import { sendMail } from "./_lib/mailer.mjs";
import { ZOHO_USER, ZOHO_PASSWORD, OWNER_EMAIL, MOCK, EMAIL_PATTERN } from "./_lib/config.mjs";
import { buildContactThanksMail, buildOwnerContactMail } from "../server/contact-email.mjs";

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

  let payload = {};
  try {
    payload = JSON.parse(await readBody(req)) || {};
  } catch {
    return json(res, 400, { ok: false, error: "Invalid JSON body." }, req.headers.origin);
  }

  const name = String(payload.name || "").trim().slice(0, 80);
  const email = String(payload.email || "").trim().toLowerCase();
  const message = String(payload.message || "").trim().slice(0, 5000);

  if (name.length < 2) return json(res, 422, { ok: false, error: "Please provide your name." }, req.headers.origin);
  if (!EMAIL_PATTERN.test(email))
    return json(res, 422, { ok: false, error: "Please provide a valid email address." }, req.headers.origin);
  if (message.length < 10)
    return json(res, 422, { ok: false, error: "Please write a message of at least 10 characters." }, req.headers.origin);

  try {
    // Owner notification: reply-to is the visitor, so "Reply" answers them directly.
    const owner = buildOwnerContactMail({ name, email, message });
    // Visitor auto-reply: warm thank-you with the "as soon as possible" promise.
    const thanks = buildContactThanksMail({ name, message });

    await sendMail(
      {
        from: `"Portfolio Contact Form" <${ZOHO_USER}>`,
        to: OWNER_EMAIL,
        replyTo: email,
        subject: owner.subject,
        text: owner.text,
        html: owner.html,
      },
      { user: ZOHO_USER, password: ZOHO_PASSWORD, mock: MOCK },
    );
    await sendMail(
      {
        from: `"Raj Kumar Sony" <${ZOHO_USER}>`,
        to: email,
        subject: thanks.subject,
        text: thanks.text,
        html: thanks.html,
      },
      { user: ZOHO_USER, password: ZOHO_PASSWORD, mock: MOCK },
    );

    console.log(
      `[contact] message from ${escapeHtml(name)} <${email}> → owner notified + thank-you sent to visitor${MOCK ? " (mock — NOT sent to Zoho)" : ""}`,
    );
    return json(res, 200, { ok: true, mock: MOCK }, req.headers.origin);
  } catch (error) {
    console.error("[contact] failed to deliver contact emails:", error);
    return json(res, 502, { ok: false, error: "Could not send your message. Please try again later." }, req.headers.origin);
  }
}

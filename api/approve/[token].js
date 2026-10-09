/**
 * GET /api/approve/[token] — owner clicked "Approve" in the notification email.
 * The token is a stateless signed payload (see api/_lib/tokens.mjs): verifying
 * it yields the requester email, then the resume email is sent from Zoho.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sendMail } from "../_lib/mailer.mjs";
import { html, json, page, escapeHtml } from "../_lib/http.mjs";
import { verifyApprovalToken } from "../_lib/tokens.mjs";
import {
  ZOHO_USER,
  ZOHO_PASSWORD,
  MOCK,
  RESUME_PUBLIC_URL,
} from "../_lib/config.mjs";
import { RESUME_ATTACHMENT_FILENAME, buildApprovedResumeMail } from "../../server/resume-request-email.mjs";
import { visitorEmailDeliverabilityError } from "../_lib/email-validation.mjs";

export const maxDuration = 15;

/** The resume PDF ships in public/; try the plausible bundle locations.
 *  Runs as an ES module on Vercel (no __dirname) — derive it from import.meta.url.
 *  Any failure here degrades to link-only email, never a 502. */
function optionalLocalResumeAttachment() {
  try {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const candidates = [
      path.join(process.cwd(), "public", "resume.pdf"),
      path.join(here, "..", "..", "public", "resume.pdf"),
      path.join(here, "..", "public", "resume.pdf"),
      path.join(here, "resume.pdf"),
    ];
    for (const candidate of candidates) {
      if (!existsSync(candidate)) continue;
      const content = readFileSync(candidate);
      if (content.length < 512 || content.slice(0, 4).toString() !== "%PDF") continue;
      return { filename: RESUME_ATTACHMENT_FILENAME, content, contentType: "application/pdf" };
    }
  } catch (error) {
    console.warn("[approve] resume.pdf unavailable, sending link-only:", error.message);
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return json(res, 405, { ok: false, error: "Method not allowed." }, req.headers.origin);
  }

  const email = verifyApprovalToken(req.query.token);
  if (!email) {
    return html(
      res,
      404,
      page("Request not found", "This link may have expired or was already handled."),
    );
  }

  const deliverabilityError = visitorEmailDeliverabilityError(email);
  if (deliverabilityError) {
    console.warn(`[approve] blocked send to undeliverable address ${email}`);
    return html(
      res,
      400,
      page(
        "Cannot send resume",
        "This request used an email address on a domain that cannot receive mail. Ask the visitor to submit again with a real inbox.",
        "#b45309",
      ),
    );
  }

  try {
    const attachment = optionalLocalResumeAttachment();
    const { subject, text, html: body } = buildApprovedResumeMail({ resumeLink: RESUME_PUBLIC_URL, requesterName: null });

    const mail = {
      from: `"Raj Kumar Sony" <${ZOHO_USER}>`,
      to: email,
      subject,
      text,
      html: body,
      attachments: attachment ? [attachment] : [],
    };

    if (MOCK) {
      console.log(
        `\n[MOCK] Resume email → ${email}\n  subject: ${subject}\n  attachment: ${attachment ? `${attachment.filename} (${attachment.content.length} bytes)` : "none"}\n`,
      );
    } else {
      await sendMail(mail, { user: ZOHO_USER, password: ZOHO_PASSWORD, mock: MOCK });
    }

    console.log(`[approve] resume sent to ${email}${attachment ? " (with PDF attachment)" : ""}`);
    return html(
      res,
      200,
      page(
        "Resume sent",
        `Your latest resume was emailed to ${escapeHtml(email)} from Zoho Mail.`,
        "#059669",
      ),
    );
  } catch (error) {
    console.error("[approve] failed to send resume:", error);
    return html(
      res,
      502,
      page("Could not send email", "Something went wrong while sending. Please try the link again; if it keeps failing, check the Vercel function logs."),
    );
  }
}

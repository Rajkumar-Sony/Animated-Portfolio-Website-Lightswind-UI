/**
 * GET /api/reject/[token] — owner clicked "Reject" in the notification email.
 * Verifies the signed token and shows a confirmation page; nothing is sent.
 */

import { html, json, page } from "../_lib/http.mjs";
import { verifyApprovalToken } from "../_lib/tokens.mjs";

export const maxDuration = 10;

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

  console.log(`[reject] discarded request from ${email}`);
  return html(res, 200, page("Request rejected", `No email was sent to ${email}.`));
}

import { escapeHtml } from "./email-utils.mjs";

const PROFILE = {
  name: "Raj Kumar Sony",
  role: "Java Backend Engineer",
  email: "rajkumar.sony@zohomail.in",
  linkedIn: "https://www.linkedin.com/in/rajkumarsony",
  github: "https://github.com/rajkumar-sony",
  photo: "https://github.com/rajkumar-sony.png?size=200",
};

/** Subject of the auto-reply sent to the visitor right after they message you. */
export function contactThanksSubject() {
  return `Thanks for reaching out — I'll reply as soon as possible | ${PROFILE.name}`;
}

const footerLinks = `
  <a href="mailto:${escapeHtml(PROFILE.email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(PROFILE.email)}</a>
  &nbsp;·&nbsp;
  <a href="${escapeHtml(PROFILE.linkedIn)}" style="color:#2563eb;text-decoration:none;">LinkedIn</a>
  &nbsp;·&nbsp;
  <a href="${escapeHtml(PROFILE.github)}" style="color:#2563eb;text-decoration:none;">GitHub</a>`;

const pageShell = (headerTag, headerTitle, headerSub, bodyHtml) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:#18181b;padding:28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1a1aa;">${escapeHtml(headerTag)}</p>
                    <h1 style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:600;color:#fafafa;line-height:1.3;">${escapeHtml(headerTitle)}</h1>
                    <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#d4d4d8;">${escapeHtml(headerSub)}</p>
                  </td>
                  <td width="72" style="vertical-align:middle;text-align:right;">
                    <img src="${escapeHtml(PROFILE.photo)}" alt="${escapeHtml(PROFILE.name)}" width="64" height="64" style="width:64px;height:64px;border-radius:50%;border:2px solid #3f3f46;object-fit:cover;display:inline-block;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#3f3f46;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #e4e4e7;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#71717a;">
              ${footerLinks}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

/**
 * Auto-reply sent to the visitor the moment they submit the contact form:
 * a warm, professional thank-you that sets the expectation of a fast reply.
 */
export function buildContactThanksMail({ name, message }) {
  const subject = contactThanksSubject();
  const greeting = name?.trim() ? `Hello ${name.trim()},` : "Hello,";
  const trimmedMessage = message.trim().slice(0, 600);

  const text = `${greeting}

Thank you for taking the time to reach out through my portfolio — I truly appreciate your interest and the effort behind your message.

This is a quick note to confirm that your message has reached me safely. I will review it carefully and respond to you as soon as possible, usually within a day.

Your message:
"${trimmedMessage}"

In the meantime, feel free to browse my projects and experience on the portfolio, or connect with me on LinkedIn.

Thank you once again for getting in touch — I look forward to speaking with you.

Warm regards,
${PROFILE.name}
${PROFILE.role}
${PROFILE.email}
LinkedIn: ${PROFILE.linkedIn}
GitHub: ${PROFILE.github}`;

  const html = pageShell(
    "Portfolio contact",
    PROFILE.name,
    PROFILE.role,
    `
    <p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
    <p style="margin:0 0 16px;">Thank you for taking the time to reach out through my portfolio — I truly appreciate your interest and the effort behind your message.</p>
    <p style="margin:0 0 16px;">This is a quick note to confirm that your message has reached me safely. I will review it carefully and <strong>respond to you as soon as possible</strong>, usually within a day.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;background:#fafafa;border:1px solid #e4e4e7;border-radius:6px;">
      <tr>
        <td style="padding:16px 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#52525b;">
          <p style="margin:0 0 8px;font-weight:600;color:#18181b;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Your message</p>
          <p style="margin:0;font-style:italic;">&ldquo;${escapeHtml(trimmedMessage)}${message.trim().length > 600 ? "&hellip;" : ""}&rdquo;</p>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 16px;">In the meantime, feel free to browse my projects and experience on the portfolio, or <a href="${escapeHtml(PROFILE.linkedIn)}" style="color:#2563eb;">connect with me on LinkedIn</a>.</p>
    <p style="margin:0 0 8px;padding:12px 16px;background:#f0fdf4;border-left:3px solid #16a34a;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#166534;">
      <strong>What happens next:</strong> I will reply to this email thread as soon as I have reviewed your message.
    </p>
    <p style="margin:24px 0 0;">Thank you once again for getting in touch — I look forward to speaking with you.</p>
    <p style="margin:20px 0 0;">Warm regards,<br><strong>${escapeHtml(PROFILE.name)}</strong><br><span style="font-size:13px;color:#71717a;">${escapeHtml(PROFILE.role)}</span></p>`,
  );

  return { subject, text, html };
}

/** Notification sent to the owner when a visitor submits the contact form. */
export function buildOwnerContactMail({ name, email, message }) {
  const subject = `New portfolio message from ${name || email}`;
  const trimmedMessage = message.trim();

  const text = `${name || "Someone"} (${email}) sent a message through your portfolio contact form.

Message:
${trimmedMessage}

Reply directly to this email to answer ${name || "them"}.`;

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
      <h2 style="margin:0 0 12px;font-size:18px">New contact-form message</h2>
      <p style="margin:0 0 4px"><strong>${escapeHtml(name || "A visitor")}</strong> (<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>) sent a message through your portfolio.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:16px 0;background:#fafafa;border:1px solid #e5e7eb;border-radius:8px;">
        <tr>
          <td style="padding:16px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#3f3f46;">
            ${escapeHtml(trimmedMessage).replace(/\n/g, "<br>")}
          </td>
        </tr>
      </table>
      <p style="margin:16px 0 0;color:#6b7280;font-size:13px">
        Press "Reply" to respond straight to their inbox — they already received a thank-you note.
      </p>
    </div>`;

  return { subject, text, html };
}

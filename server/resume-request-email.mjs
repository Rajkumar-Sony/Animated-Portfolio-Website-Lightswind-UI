import { salutationForRequester } from "./derive-name-from-email.mjs";

/** Filename used when the approved resume PDF is attached. */
export const RESUME_ATTACHMENT_FILENAME = "RajKumarSony_JavaBackendEngineer_Resume.pdf";

const PROFILE = {
  name: "Raj Kumar Sony",
  role: "Java Backend Engineer",
  email: "rajkumar.sony@zohomail.in",
  linkedIn: "https://www.linkedin.com/in/rajkumarsony",
  github: "https://github.com/rajkumar-sony",
  photo: "https://github.com/rajkumar-sony.png?size=200",
};

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

export function approvedResumeSubject() {
  return `Thank you for your interest — ${PROFILE.name} | ${PROFILE.role} (Resume attached)`;
}

/**
 * Email sent to the requester immediately after the owner approves a portfolio resume request.
 */
export function buildApprovedResumeMail({ resumeLink, requesterName }) {
  const subject = approvedResumeSubject();
  const link = resumeLink || "";
  const greeting = salutationForRequester(requesterName);
  const greetingHtml = escapeHtml(greeting);

  const text = `${greeting}

Thank you sincerely for your time, kindness, and interest in my profile. I genuinely appreciate the effort that goes into reviewing candidates and coordinating opportunities.

I am a Java Backend Engineer with 4+ years of experience building scalable systems with Java, Spring Boot, Microservices, REST APIs, React, and AWS. At PLAN-B, Inc. in Japan, I work on SaaS products—designing services, improving API performance, and supporting production releases.

I am currently exploring Backend / Java Engineer opportunities across India. If there are openings that align with my background, I would be grateful to learn more. If you are comfortable, I would also sincerely appreciate a referral for a suitable role.

Key details:
• Experience: 4+ years (Java, Spring Boot, Microservices, REST, React, AWS)
• Current CTC: 19 LPA
• Expected CTC: Open to aligning with the budget specified for the position
• Notice period: 30 days
• Current location: Osaka, Japan
• Preferred location: Anywhere in India

My latest resume (${RESUME_ATTACHMENT_FILENAME}) is attached for your convenience.
${link ? `\nIf the attachment does not open, you may access a copy here:\n${link}\n` : ""}
Thank you once again for your consideration and support.

Best regards,
${PROFILE.name}
${PROFILE.email}
LinkedIn: ${PROFILE.linkedIn}
GitHub: ${PROFILE.github}`;

  const html = `<!DOCTYPE html>
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
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#a1a1aa;">Resume &amp; introduction</p>
                    <h1 style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:600;color:#fafafa;line-height:1.3;">${escapeHtml(PROFILE.name)}</h1>
                    <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#d4d4d8;">${escapeHtml(PROFILE.role)}</p>
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
              <p style="margin:0 0 16px;">${greetingHtml}</p>
              <p style="margin:0 0 16px;">Thank you sincerely for your time, kindness, and interest in my profile. I genuinely appreciate the effort that goes into reviewing candidates and coordinating opportunities.</p>
              <p style="margin:0 0 16px;">I am a <strong>Java Backend Engineer</strong> with <strong>4+ years</strong> of experience building scalable systems with Java, Spring Boot, Microservices, REST APIs, React, and AWS. At <strong>PLAN-B, Inc.</strong> in Japan, I work on SaaS products—designing services, improving API performance, and supporting production releases.</p>
              <p style="margin:0 0 20px;">I am currently exploring Backend / Java Engineer opportunities across India. If there are openings that align with my background, I would be grateful to learn more. If you are comfortable, I would also sincerely appreciate a referral for a suitable role.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;background:#fafafa;border:1px solid #e4e4e7;border-radius:6px;">
                <tr>
                  <td style="padding:16px 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#52525b;">
                    <p style="margin:0 0 8px;font-weight:600;color:#18181b;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Profile summary</p>
                    <ul style="margin:0;padding-left:18px;">
                      <li style="margin-bottom:6px;">Experience: 4+ years (Java, Spring Boot, Microservices, REST, React, AWS)</li>
                      <li style="margin-bottom:6px;">Current CTC: 19 LPA</li>
                      <li style="margin-bottom:6px;">Expected CTC: Open to aligning with the budget specified for the position</li>
                      <li style="margin-bottom:6px;">Notice period: 30 days</li>
                      <li style="margin-bottom:6px;">Current location: Osaka, Japan</li>
                      <li>Preferred location: Anywhere in India</li>
                    </ul>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;padding:12px 16px;background:#f0fdf4;border-left:3px solid #16a34a;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#166534;">
                <strong>Resume attached:</strong> ${escapeHtml(RESUME_ATTACHMENT_FILENAME)}
              </p>
              ${
                link
                  ? `<p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#71717a;">If the attachment does not open, you may <a href="${escapeHtml(link)}" style="color:#2563eb;">access a copy online</a>.</p>`
                  : ""
              }
              <p style="margin:24px 0 0;">Thank you once again for your consideration and support.</p>
              <p style="margin:20px 0 0;">Best regards,<br><strong>${escapeHtml(PROFILE.name)}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #e4e4e7;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#71717a;">
              <a href="mailto:${escapeHtml(PROFILE.email)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(PROFILE.email)}</a>
              &nbsp;·&nbsp;
              <a href="${escapeHtml(PROFILE.linkedIn)}" style="color:#2563eb;text-decoration:none;">LinkedIn</a>
              &nbsp;·&nbsp;
              <a href="${escapeHtml(PROFILE.github)}" style="color:#2563eb;text-decoration:none;">GitHub</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

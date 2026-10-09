/**
 * Test Zoho SMTP using .env.local. Run: npm run resume-server:verify-smtp
 */
import nodemailer from "nodemailer";

const user = process.env.ZOHO_MAIL_USER || "";
const pass = (process.env.ZOHO_MAIL_APP_PASSWORD || "").replace(/\s+/g, "");
const to = process.env.RESUME_OWNER_EMAIL || user;

if (!user || !pass) {
  console.error("Set ZOHO_MAIL_USER and ZOHO_MAIL_APP_PASSWORD in .env.local first.");
  process.exit(1);
}

const transports = [
  { label: "smtp.zoho.in:465 (SSL)", host: "smtp.zoho.in", port: 465, secure: true },
  { label: "smtp.zoho.in:587 (STARTTLS)", host: "smtp.zoho.in", port: 587, secure: false, requireTLS: true },
];

let transporter = null;
let label = "";

for (const cfg of transports) {
  const candidate = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    requireTLS: cfg.requireTLS,
    auth: { user, pass },
  });
  try {
    await candidate.verify();
    transporter = candidate;
    label = cfg.label;
    break;
  } catch {
    /* try next */
  }
}

if (!transporter) {
  console.error("SMTP failed on all Zoho endpoints (535 usually means wrong app password or SMTP disabled in Mail → Settings → Mail accounts → SMTP).");
  process.exit(1);
}

console.log(`SMTP login OK via ${label}.`);
await transporter.sendMail({
  from: `"Portfolio test" <${user}>`,
  to,
  subject: "Resume server SMTP test",
  text: "If you see this, Zoho SMTP is configured correctly for the portfolio resume server.",
});
console.log(`Test email sent to ${to}.`);

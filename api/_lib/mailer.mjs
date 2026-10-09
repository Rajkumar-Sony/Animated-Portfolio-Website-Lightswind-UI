/** Zoho SMTP transport for the portfolio's serverless email functions. */

import nodemailer from "nodemailer";

const SMTP_HOST = "smtp.zoho.in";

let transporter = null;

async function createZohoTransporter(user, password) {
  const attempts = [
    { host: SMTP_HOST, port: 465, secure: true },
    { host: SMTP_HOST, port: 587, secure: false, requireTLS: true },
  ];
  for (const cfg of attempts) {
    const t = nodemailer.createTransport({
      ...cfg,
      pool: false,
      auth: { user, pass: password },
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

async function getTransporter(user, password) {
  if (!transporter) transporter = await createZohoTransporter(user, password);
  return transporter;
}

/**
 * Send mail, retrying once with a fresh transporter if the connection dropped.
 * In MOCK mode nothing is sent — the mail is printed to the function logs instead.
 */
export async function sendMail(mail, { user, password, mock }) {
  if (mock) {
    console.log(
      `\n[MOCK] Email → ${mail.to}\n  from: ${mail.from}\n  subject: ${mail.subject}\n  replyTo: ${mail.replyTo || "-"}\n  body:\n${mail.text || mail.html}\n`,
    );
    return;
  }
  const t = await getTransporter(user, password);
  try {
    return await t.sendMail(mail);
  } catch (error) {
    if (error.code === "ECONNECTION" || error.code === "ESTREAM" || /connection/i.test(error.message)) {
      transporter = null;
      const fresh = await getTransporter(user, password);
      return await fresh.sendMail(mail);
    }
    throw error;
  }
}

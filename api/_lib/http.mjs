/** Shared HTTP helpers for the portfolio's Vercel serverless functions. */

import { corsOrigin } from "./config.mjs";

export const json = (res, status, payload, origin) => {
  const headers = { "Content-Type": "application/json" };
  const allow = corsOrigin(origin);
  if (allow) {
    headers["Access-Control-Allow-Origin"] = allow;
    headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
  }
  res.writeHead(status, headers);
  res.end(JSON.stringify(payload));
};

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

/** Minimal result page shown after the owner clicks Approve/Reject in the email. */
export const page = (title, body, color = "#111827") => `<!doctype html>
<html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="font-family:Arial,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f9fafb">
  <div style="text-align:center;padding:40px;border:1px solid #e5e7eb;border-radius:16px;background:#fff">
    <h1 style="color:${color};font-size:22px">${escapeHtml(title)}</h1>
    <p style="color:#6b7280">${body}</p>
  </div>
</body></html>`;

export const html = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
  res.end(body);
};

export const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 10_000) req.destroy();
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

export { escapeHtml };

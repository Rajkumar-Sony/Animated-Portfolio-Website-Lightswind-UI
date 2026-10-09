/** Shared helpers for the portfolio's mail servers. */

/** Minimal HTML escaping for interpolating visitor input into emails. */
export const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

/** Local parts that are not personal names (recruiting inboxes, noreply, etc.). */
const GENERIC_LOCAL_PARTS = new Set([
  "admin",
  "careers",
  "contact",
  "email",
  "hello",
  "help",
  "hiring",
  "hr",
  "info",
  "jobs",
  "mail",
  "noreply",
  "no-reply",
  "recruit",
  "recruiter",
  "recruiters",
  "recruiting",
  "recruitment",
  "service",
  "support",
  "talent",
  "team",
]);

const titleCase = (word) =>
  word.length ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : "";

/**
 * Infer a display name from an email address (business-style first.last, first_last, etc.).
 * Returns null when the local part looks like a shared inbox or cannot be parsed confidently.
 */
export function deriveNameFromEmail(email) {
  const trimmed = String(email).trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at <= 0) return null;

  let local = trimmed.slice(0, at);
  // Strip plus-address tags: name+tag@domain
  local = local.split("+")[0];
  // Remove trailing digits often used in personal addresses (e.g. rk.sony4848)
  local = local.replace(/\d+$/u, "");
  local = local.replace(/[._-]+/g, " ").trim();
  if (!local || GENERIC_LOCAL_PARTS.has(local.replace(/\s/g, ""))) return null;

  let parts;
  const rawLocal = trimmed.slice(0, at).split("+")[0];
  if (rawLocal.includes(".")) parts = rawLocal.split(".");
  else if (rawLocal.includes("_")) parts = rawLocal.split("_");
  else if (rawLocal.includes("-")) parts = rawLocal.split("-");
  else parts = local.split(/\s+/);

  parts = parts
    .map((p) => p.replace(/\d+/gu, "").trim())
    .filter((p) => p.length >= 2 && !GENERIC_LOCAL_PARTS.has(p));

  if (parts.length === 0) return null;
  if (parts.length === 1 && parts[0].length < 4) return null;

  return parts.map(titleCase).join(" ");
}

/** Salutation for outbound mail: uses derived full name when available. */
export function salutationForRequester(requesterName) {
  const name = requesterName?.trim();
  if (name) return `Dear ${name},`;
  return "Dear Hiring Team,";
}

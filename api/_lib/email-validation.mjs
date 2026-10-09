/**
 * Reject visitor addresses on domains that cannot receive mail (Null MX, RFC 2606
 * documentation names, etc.). Prevents Zoho bounces like 556 5.7.27 on example.com.
 */

/** Domains that must never receive outbound mail from this portfolio. */
const BLOCKED_DOMAINS = new Set([
  "example.com",
  "example.net",
  "example.org",
  "example.edu",
  "test",
  "invalid",
  "localhost",
  "local",
]);

/** TLDs reserved for documentation / non-deliverable use. */
const BLOCKED_TLD_SUFFIXES = [".test", ".invalid", ".localhost", ".local", ".example"];

export const UNDELIVERABLE_EMAIL_MESSAGE =
  "Please use a real email address you can receive mail at. That domain cannot accept email.";

/**
 * @returns {string | null} User-facing error message, or null when delivery may be attempted.
 */
export function visitorEmailDeliverabilityError(email) {
  const normalized = String(email).trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0 || at === normalized.length - 1) return UNDELIVERABLE_EMAIL_MESSAGE;

  const domain = normalized.slice(at + 1);
  if (BLOCKED_DOMAINS.has(domain)) return UNDELIVERABLE_EMAIL_MESSAGE;

  for (const suffix of BLOCKED_TLD_SUFFIXES) {
    if (domain === suffix.slice(1) || domain.endsWith(suffix)) return UNDELIVERABLE_EMAIL_MESSAGE;
  }

  // Obvious placeholders often used in demos and automated tests.
  if (/^(mailinator|yopmail|guerrillamail|tempmail|10minutemail)\./i.test(domain)) {
    return UNDELIVERABLE_EMAIL_MESSAGE;
  }

  return null;
}

export function isVisitorEmailDeliverable(email) {
  return visitorEmailDeliverabilityError(email) === null;
}

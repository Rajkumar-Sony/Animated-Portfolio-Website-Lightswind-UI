/** Client-side mirror of api/_lib/email-validation.mjs for early form feedback. */

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

const BLOCKED_TLD_SUFFIXES = [".test", ".invalid", ".localhost", ".local", ".example"];

export const UNDELIVERABLE_EMAIL_MESSAGE =
  "Please use a real email address you can receive mail at. That domain cannot accept email.";

export function visitorEmailDeliverabilityError(email: string): string | undefined {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0 || at === normalized.length - 1) return UNDELIVERABLE_EMAIL_MESSAGE;

  const domain = normalized.slice(at + 1);
  if (BLOCKED_DOMAINS.has(domain)) return UNDELIVERABLE_EMAIL_MESSAGE;

  for (const suffix of BLOCKED_TLD_SUFFIXES) {
    if (domain === suffix.slice(1) || domain.endsWith(suffix)) return UNDELIVERABLE_EMAIL_MESSAGE;
  }

  if (/^(mailinator|yopmail|guerrillamail|tempmail|10minutemail)\./i.test(domain)) {
    return UNDELIVERABLE_EMAIL_MESSAGE;
  }

  return undefined;
}

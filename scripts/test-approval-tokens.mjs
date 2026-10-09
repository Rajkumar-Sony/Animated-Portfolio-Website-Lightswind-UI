/**
 * Regression tests for the stateless approval tokens used by the Vercel
 * approve/reject endpoints (api/approve, api/reject).
 *
 * Run: APPROVAL_TOKEN_SECRET=test-secret-0123456789 node scripts/test-approval-tokens.mjs
 * Exit code 0 = all pass.
 */

process.env.APPROVAL_TOKEN_SECRET = process.env.APPROVAL_TOKEN_SECRET || "test-secret-0123456789";
// Keep the expiry check testable: everything older than 1 hour is rejected.
process.env.TOKEN_MAX_AGE_MS = String(60 * 60 * 1000);

const { signApprovalToken, verifyApprovalToken } = await import("../api/_lib/tokens.mjs");
import assert from "node:assert/strict";

const checks = [];
const test = (name, fn) => checks.push({ name, fn });

test("round-trip: verify(sign(email)) returns the email", () => {
  assert.equal(verifyApprovalToken(signApprovalToken("recruiter@example.com")), "recruiter@example.com");
});

test("tampered signature is rejected", () => {
  const token = signApprovalToken("recruiter@example.com");
  const parts = token.split(".");
  parts[2] = parts[2].slice(0, -2) + (parts[2].endsWith("AA") ? "BB" : "AA");
  assert.equal(verifyApprovalToken(parts.join(".")), null);
});

test("swapped email with original signature is rejected", () => {
  const token = signApprovalToken("recruiter@example.com");
  const [emailB64, issuedAtB64, sig] = token.split(".");
  const forgedEmail = Buffer.from("attacker@evil.com").toString("base64url");
  assert.equal(verifyApprovalToken([forgedEmail, issuedAtB64, sig].join(".")), null);
});

test("expired token is rejected", () => {
  process.env.TOKEN_MAX_AGE_MS = "-1"; // everything older than "now - (-1ms)" is expired
  const token = signApprovalToken("recruiter@example.com");
  assert.equal(verifyApprovalToken(token), null);
  process.env.TOKEN_MAX_AGE_MS = String(60 * 60 * 1000);
});

test("malformed tokens are rejected", () => {
  for (const bad of ["", "junk", "a.b.c", "!!not-base64!!", signApprovalToken("x@y.com") + ".extra"]) {
    assert.equal(verifyApprovalToken(bad), null, `should reject: ${bad}`);
  }
});

test("token signed with a different secret is rejected", async () => {
  process.env.APPROVAL_TOKEN_SECRET = "another-secret-9876543210";
  const forged = await import("../api/_lib/tokens.mjs");
  const token = forged.signApprovalToken("recruiter@example.com");
  process.env.APPROVAL_TOKEN_SECRET = "test-secret-0123456789";
  assert.equal(verifyApprovalToken(token), null);
});

test("tokens disabled without a secret (verify fails closed)", () => {
  process.env.APPROVAL_TOKEN_SECRET = "short";
  assert.equal(verifyApprovalToken("a.b.c"), null);
  assert.throws(() => signApprovalToken("x@y.com"));
  process.env.APPROVAL_TOKEN_SECRET = "test-secret-0123456789";
});

let failed = 0;
for (const { name, fn } of checks) {
  try {
    await fn();
    console.log(`  ok  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL  ${name}\n      ${error.message}`);
  }
}

console.log(`\n${checks.length - failed}/${checks.length} token tests passed`);
process.exit(failed ? 1 : 0);

import assert from "node:assert/strict";
import {
  isVisitorEmailDeliverable,
  visitorEmailDeliverabilityError,
} from "../api/_lib/email-validation.mjs";

const cases = [
  ["client-test@example.com", false],
  ["user@example.org", false],
  ["a@localhost", false],
  ["x@mail.test", false],
  ["recruiter@gmail.com", true],
  ["rk.sony4848@gmail.com", true],
  ["hr@company.co.in", true],
  ["rajkumar.sony@zohomail.in", true],
];

let failed = 0;
for (const [email, deliverable] of cases) {
  const ok = isVisitorEmailDeliverable(email) === deliverable;
  if (!ok) {
    failed += 1;
    console.error(`FAIL ${email} expected deliverable=${deliverable}`);
  } else {
    console.log(`  ok  ${email}`);
  }
}

assert.equal(visitorEmailDeliverabilityError("x@example.com"), visitorEmailDeliverabilityError("x@example.net"));
console.log(`\n${cases.length - failed}/${cases.length} deliverability tests passed`);
process.exit(failed ? 1 : 0);

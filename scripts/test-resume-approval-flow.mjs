import assert from "node:assert/strict";
import { Readable } from "node:stream";

process.env.APPROVAL_TOKEN_SECRET = "test-secret-0123456789";
process.env.ZOHO_MAIL_USER = "owner@example.com";
process.env.RESUME_OWNER_EMAIL = "owner@example.com";
process.env.ZOHO_MAIL_APP_PASSWORD = "";
process.env.RESUME_PUBLIC_URL = "https://example.com/private-resume.pdf";
process.env.RESUME_SERVER_PUBLIC_URL = "https://portfolio.example.com";

const requestHandler = (await import("../api/resume-request.js")).default;
const approveHandler = (await import("../api/approve/[token].js")).default;
const rejectHandler = (await import("../api/reject/[token].js")).default;
const { signApprovalToken } = await import("../api/_lib/tokens.mjs");

function createJsonReq({ method = "POST", body = {}, token } = {}) {
  const req = Readable.from([JSON.stringify(body)]);
  req.method = method;
  req.headers = { origin: "https://portfolio.example.com" };
  req.query = token ? { token } : {};
  return req;
}

function createRes() {
  return {
    statusCode: 200,
    headers: {},
    body: "",
    writeHead(statusCode, headers = {}) {
      this.statusCode = statusCode;
      this.headers = { ...this.headers, ...headers };
    },
    end(chunk = "") {
      this.body += chunk;
      return this;
    },
  };
}

async function captureConsole(fn) {
  const lines = [];
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  console.log = (...args) => lines.push(args.join(" "));
  console.warn = (...args) => lines.push(args.join(" "));
  console.error = (...args) => lines.push(args.join(" "));
  try {
    const result = await fn();
    return { result, output: lines.join("\n") };
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }
}

const checks = [];
const test = (name, fn) => checks.push({ name, fn });

test("resume request only sends owner approval email and does not expose the resume", async () => {
  const req = createJsonReq({ body: { email: "recruiter@gmail.com", source: "resume-request" } });
  const res = createRes();

  const { output } = await captureConsole(() => requestHandler(req, res));

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /"ok":true/);
  assert.match(output, /Approval email that would be sent to owner@example\.com/);
  assert.doesNotMatch(output, /Resume email/);
  assert.doesNotMatch(output, /private-resume\.pdf/);
});

test("approve link sends the resume email to the requester", async () => {
  const token = signApprovalToken("recruiter@gmail.com");
  const req = createJsonReq({ method: "GET", token });
  const res = createRes();

  const { output } = await captureConsole(() => approveHandler(req, res));

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /Resume sent/);
  assert.match(output, /Resume email .*recruiter@gmail\.com/);
});

test("reject link does not send a resume email", async () => {
  const token = signApprovalToken("recruiter@gmail.com");
  const req = createJsonReq({ method: "GET", token });
  const res = createRes();

  const { output } = await captureConsole(() => rejectHandler(req, res));

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /Request rejected/);
  assert.match(output, /discarded request from recruiter@gmail\.com/);
  assert.doesNotMatch(output, /Resume email/);
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

console.log(`\n${checks.length - failed}/${checks.length} resume approval flow tests passed`);
process.exit(failed ? 1 : 0);

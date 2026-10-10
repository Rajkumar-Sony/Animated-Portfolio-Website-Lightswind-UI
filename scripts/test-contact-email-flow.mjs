import assert from "node:assert/strict";
import { Readable } from "node:stream";

process.env.ZOHO_MAIL_USER = "owner@example.com";
process.env.RESUME_OWNER_EMAIL = "owner@example.com";
process.env.ZOHO_MAIL_APP_PASSWORD = "";

const contactHandler = (await import("../api/contact.js")).default;

function createJsonReq({ method = "POST", body = {}, origin = "https://portfolio.example.com" } = {}) {
  const req = Readable.from([JSON.stringify(body)]);
  req.method = method;
  req.headers = { origin };
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
    await fn();
    return lines.join("\n");
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }
}

const checks = [];
const test = (name, fn) => checks.push({ name, fn });

test("contact submission sends owner notification and visitor thank-you email", async () => {
  const req = createJsonReq({
    body: {
      name: "Recruiter",
      email: "recruiter@gmail.com",
      message: "Hello Raj, I would like to discuss a backend role with you.",
    },
  });
  const res = createRes();

  const output = await captureConsole(() => contactHandler(req, res));

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /"ok":true/);
  assert.match(output, /Email → owner@example\.com/);
  assert.match(output, /subject: New portfolio message from Recruiter/);
  assert.match(output, /replyTo: recruiter@gmail\.com/);
  assert.match(output, /Email → recruiter@gmail\.com/);
  assert.match(output, /subject: Thanks for reaching out/);
  assert.match(output, /I truly appreciate your interest/);
  assert.match(output, /respond to you as soon as possible/);
});

test("invalid contact email is rejected before any email is emitted", async () => {
  const req = createJsonReq({
    body: {
      name: "Recruiter",
      email: "client@example.com",
      message: "Hello Raj, this should not be sent.",
    },
  });
  const res = createRes();

  const output = await captureConsole(() => contactHandler(req, res));

  assert.equal(res.statusCode, 422);
  assert.match(res.body, /real email address/);
  assert.doesNotMatch(output, /Email →/);
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

console.log(`\n${checks.length - failed}/${checks.length} contact email flow tests passed`);
process.exit(failed ? 1 : 0);

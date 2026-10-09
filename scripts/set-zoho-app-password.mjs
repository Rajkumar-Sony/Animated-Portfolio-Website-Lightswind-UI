/**
 * Securely store Zoho app password in .env.local (never printed).
 * Run after creating the password in Zoho Accounts → Security → App Passwords:
 *   npm run resume-server:set-password
 */
import { createInterface } from "node:readline";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
const KEY = "ZOHO_MAIL_APP_PASSWORD";

const rl = createInterface({ input: process.stdin, output: process.stdout });

const ask = (question, { hidden = false } = {}) =>
  new Promise((resolve) => {
    if (!hidden) {
      rl.question(question, resolve);
      return;
    }
    process.stdout.write(question);
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;
    if (!stdin.isTTY) {
      rl.question("", resolve);
      return;
    }
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (char) => {
      if (char === "\u0003") process.exit(1);
      if (char === "\r" || char === "\n") {
        stdin.setRawMode(wasRaw);
        stdin.pause();
        stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(value);
        return;
      }
      if (char === "\u007f") {
        value = value.slice(0, -1);
        return;
      }
      value += char;
    };
    stdin.on("data", onData);
  });

let env = readFileSync(envPath, "utf8");
const password = (await ask("Paste Zoho app password (input hidden): ", { hidden: true })).trim();
rl.close();

if (!password) {
  console.error("No password entered.");
  process.exit(1);
}

const line = `${KEY}=${password}`;
if (new RegExp(`^${KEY}=`, "m").test(env)) {
  env = env.replace(new RegExp(`^${KEY}=.*$`, "m"), line);
} else {
  env = `${env.trimEnd()}\n${line}\n`;
}

writeFileSync(envPath, env, { mode: 0o600 });
console.log(`Updated ${KEY} in .env.local. Run: npm run resume-server:verify-smtp`);

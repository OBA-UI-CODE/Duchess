import assert from "node:assert/strict";
import test from "node:test";
import { orderEmailText, sendOrderEmail } from "./order-email.ts";

test("pending order email states that payment was not taken", () => {
  const message = orderEmailText({ orderNumber: "DUC-123", totalKobo: 1250000, firstName: "Ada" });
  assert.match(message, /DUC-123/);
  assert.match(message, /Ada/);
  assert.match(message, /₦12,500/);
  assert.match(message, /Payment has not been taken/);
  assert.doesNotMatch(message, /payment confirmed/i);
});

test("Mailgun request uses the server-side sending key and domain", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.MAILGUN_API_KEY;
  const originalDomain = process.env.MAILGUN_DOMAIN;
  const originalUrl = process.env.MAILGUN_API_URL;
  process.env.MAILGUN_API_KEY = "test-key";
  process.env.MAILGUN_DOMAIN = "sandbox.example.mailgun.org";
  process.env.MAILGUN_API_URL = "https://api.mailgun.net";
  let called = false;
  globalThis.fetch = async (input, init) => {
    called = true;
    assert.equal(input, "https://api.mailgun.net/v3/sandbox.example.mailgun.org/messages");
    assert.equal(init?.method, "POST");
    assert.equal((init?.headers as Record<string, string>).Authorization, `Basic ${Buffer.from("api:test-key").toString("base64")}`);
    const body = init?.body as FormData;
    assert.equal(body.get("to"), "ada@example.com");
    assert.match(String(body.get("text")), /Payment has not been taken/);
    return new Response("{}", { status: 200 });
  };
  try {
    await sendOrderEmail("ada@example.com", { orderNumber: "DUC-123", totalKobo: 1250000, firstName: "Ada" });
    assert.equal(called, true);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.MAILGUN_API_KEY; else process.env.MAILGUN_API_KEY = originalKey;
    if (originalDomain === undefined) delete process.env.MAILGUN_DOMAIN; else process.env.MAILGUN_DOMAIN = originalDomain;
    if (originalUrl === undefined) delete process.env.MAILGUN_API_URL; else process.env.MAILGUN_API_URL = originalUrl;
  }
});

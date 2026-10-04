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

test("Resend request uses the server-side API key and from address", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.RESEND_API_KEY;
  const originalFrom = process.env.RESEND_FROM;
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.RESEND_FROM = "Duchess <orders@duchess.store>";

  let called = false;
  let capturedUrl = "";
  let capturedOptions: RequestInit = {};

  globalThis.fetch = async (input, init) => {
    called = true;
    capturedUrl = String(input);
    capturedOptions = init ?? {};
    return new Response(JSON.stringify({ id: "mock-id" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  try {
    await sendOrderEmail("ada@example.com", { orderNumber: "DUC-123", totalKobo: 1250000, firstName: "Ada" });
    assert.equal(called, true);
    assert.match(capturedUrl, /api\.resend\.com\/emails/);
    assert.equal(capturedOptions?.method, "POST");

    const headers = new Headers(capturedOptions.headers);
    const authHeader = headers.get("Authorization");
    assert.equal(authHeader, "Bearer re_test_key");
    assert.equal(headers.get("Idempotency-Key"), "order-received/DUC-123");

    const body = JSON.parse(String(capturedOptions?.body));
    assert.equal(body.to, "ada@example.com");
    assert.equal(body.from, "Duchess <orders@duchess.store>");
    assert.match(body.text, /Payment has not been taken/);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = originalKey;
    if (originalFrom === undefined) delete process.env.RESEND_FROM; else process.env.RESEND_FROM = originalFrom;
  }
});


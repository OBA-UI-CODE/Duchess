export type OrderEmail = {
  orderNumber: string;
  totalKobo: number;
  firstName: string;
};

export class MailgunResponseError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Mailgun rejected the message (${status})`);
    this.status = status;
  }
}

export function orderEmailText({ orderNumber, totalKobo, firstName }: OrderEmail) {
  const total = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(totalKobo / 100);
  return `Hello ${firstName},\n\nWe received your Duchess order ${orderNumber}.\nOrder total: ${total}.\n\nPayment has not been taken. Your order is pending while online payment is unavailable. We will share payment instructions when this option is ready.\n\nIf you did not place this order, please disregard this message.\n\nDuchess`;
}

export async function sendOrderEmail(to: string, order: OrderEmail): Promise<void> {
  const key = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const apiUrl = process.env.MAILGUN_API_URL;
  if (!key || !domain || !apiUrl) throw new Error("Mailgun is not configured");
  if (!/^https:\/\/api(?:\.eu)?\.mailgun\.net\/?$/.test(apiUrl)) throw new Error("Invalid Mailgun API URL");

  const body = new FormData();
  body.set("from", `Duchess <postmaster@${domain}>`);
  body.set("to", to);
  body.set("subject", `We received your Duchess order ${order.orderNumber}`);
  body.set("text", orderEmailText(order));

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/v3/${encodeURIComponent(domain)}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`api:${key}`).toString("base64")}` },
    body,
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new MailgunResponseError(response.status);
}

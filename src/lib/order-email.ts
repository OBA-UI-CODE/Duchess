import { Resend } from "resend";

export type OrderEmail = {
  orderNumber: string;
  totalKobo: number;
  firstName: string;
};

export class ResendResponseError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`Resend rejected the message (${status})`);
    this.status = status;
  }
}

export function orderEmailText({ orderNumber, totalKobo, firstName }: OrderEmail) {
  const total = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(totalKobo / 100);
  return `Hello ${firstName},\n\nWe received your Duchess order ${orderNumber}.\nOrder total: ${total}.\n\nPayment has not been taken. Your order is pending while online payment is unavailable. We will share payment instructions when this option is ready.\n\nIf you did not place this order, please disregard this message.\n\nDuchess`;
}

export async function sendOrderEmail(to: string, order: OrderEmail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) throw new Error("Resend is not configured");

  const resend = new Resend(key);
  const { error } = await resend.emails.send(
    {
      from,
      to,
      subject: `We received your Duchess order ${order.orderNumber}`,
      text: orderEmailText(order),
    },
    { idempotencyKey: `order-received/${order.orderNumber}` },
  );

  if (error) throw new ResendResponseError((error as { statusCode?: number }).statusCode ?? 500);
}


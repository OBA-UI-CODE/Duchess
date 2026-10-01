import { createClient } from "@/lib/supabase/server";
import { MailgunResponseError, sendOrderEmail } from "@/lib/order-email";

type CheckoutInput = {
  email?: unknown;
  shippingAddress?: unknown;
  items?: unknown;
};

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  let originHost: string | null = null;
  try { originHost = origin ? new URL(origin).host : null; } catch { return Response.json({ error: "Invalid request origin" }, { status: 403 }); }
  if (originHost && originHost !== request.headers.get("host")) {
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  }

  let input: CheckoutInput;
  try { input = await request.json(); } catch { return Response.json({ error: "Invalid checkout details" }, { status: 400 }); }
  const address = input.shippingAddress;
  const items = input.items;
  if (
    typeof input.email !== "string" || input.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
    !address || typeof address !== "object" || Array.isArray(address) ||
    !items || !Array.isArray(items) || items.length < 1 || items.length > 20
  ) return Response.json({ error: "Please check your checkout details" }, { status: 400 });

  const shipping = address as Record<string, unknown>;
  if (["full_name", "phone", "line1", "city", "state"].some((field) => typeof shipping[field] !== "string" || !(shipping[field] as string).trim() || (shipping[field] as string).length > 200) ||
    items.some((item) => !item || typeof item !== "object" || !/^[0-9a-f-]{36}$/i.test(String(item.product_id)) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 || typeof item.option !== "string" || item.option.length > 100)
  ) return Response.json({ error: "Please check your checkout details" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_pending_order", {
    p_email: input.email,
    p_shipping_address: shipping,
    p_items: items,
    p_delivery_kobo: shipping.state === "Lagos" ? 350000 : 650000,
  });
  if (error || !data?.order_number) {
    return Response.json({ error: error?.message ?? "Could not create the order" }, { status: 400 });
  }

  let emailSent = false;
  for (let attempt = 1; attempt <= 2 && !emailSent; attempt++) {
    try {
      await sendOrderEmail(input.email, {
        orderNumber: data.order_number,
        totalKobo: data.total_kobo,
        firstName: String(shipping.full_name).trim().split(/\s+/)[0],
      });
      emailSent = true;
    } catch (mailError) {
      // The order is valid even if Mailgun is unavailable or the sandbox rejects this address.
      console.error("Order email failed", { orderNumber: data.order_number, attempt, reason: mailError instanceof Error ? mailError.message : "Unknown error" });
      if (!(mailError instanceof MailgunResponseError) || (mailError.status !== 429 && mailError.status < 500)) break;
    }
  }

  return Response.json({ orderNumber: data.order_number, emailSent }, { status: 201 });
}

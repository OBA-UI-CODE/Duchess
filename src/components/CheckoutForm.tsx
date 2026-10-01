"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { Header } from "@/components/Header";
import { useCommerce } from "@/components/CommerceProvider";
import { formatNaira } from "@/lib/product-types";
import { createClient } from "@/lib/supabase/client";

export function CheckoutForm() {
  const { cart, subtotal, clearCart } = useCommerce();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("Lagos");
  const delivery = location === "Lagos" ? 350000 : 650000;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const { data, error: submitError } = await createClient().rpc("create_pending_order", {
      p_email: String(form.get("email")),
      p_shipping_address: {
        full_name: `${form.get("firstName")} ${form.get("lastName")}`.trim(), phone: String(form.get("phone")),
        line1: String(form.get("address")), city: String(form.get("city")), state: String(form.get("state")), note: String(form.get("note") ?? ""),
      },
      p_items: cart.map((item) => ({ product_id: item.product.id, option: item.option, quantity: item.quantity })),
      p_delivery_kobo: delivery,
    });
    if (submitError) { setError(submitError.message); setLoading(false); return; }
    setOrderNumber((data as { order_number?: string } | null)?.order_number ?? "Order created");
    clearCart(); setLoading(false);
  }

  if (!cart.length && !orderNumber) return <main><Header /><section className="commerce-page"><div className="empty-state"><h1>Your bag is empty.</h1><p>Add a product before starting checkout.</p><Link className="primary-action" href="/shop">Shop the collection</Link></div></section></main>;

  return <main><Header /><section className="checkout-page"><div className="checkout-form"><p className="eyebrow purple">Secure checkout</p><h1>Where should we send it?</h1><p>Complete your delivery details. Online payment will be enabled after Paystack is connected.</p>{orderNumber ? <div className="checkout-saved"><CheckCircle2 /><div><h2>Order received</h2><p>Reference: <strong>{orderNumber}</strong>. No charge has been made.</p></div></div> : <form onSubmit={submit}><fieldset><legend>Contact</legend><label>Email address<input required type="email" name="email" autoComplete="email" /></label><label>Phone number<input required type="tel" name="phone" autoComplete="tel" /></label></fieldset><fieldset><legend>Delivery address</legend><div className="form-grid"><label>First name<input required name="firstName" autoComplete="given-name" /></label><label>Last name<input required name="lastName" autoComplete="family-name" /></label></div><label>Street address<input required name="address" autoComplete="street-address" /></label><div className="form-grid"><label>City<input required name="city" autoComplete="address-level2" /></label><label>State<select value={location} onChange={(event) => setLocation(event.target.value)} name="state"><option>Lagos</option><option>Abuja</option><option>Rivers</option><option>Oyo</option><option value="Other">Other state</option></select></label></div><label>Delivery note <span>(optional)</span><textarea name="note" rows={3} /></label></fieldset>{error && <p className="auth-message" role="alert">{error}</p>}<button className="primary-action" type="submit" disabled={loading}>{loading ? "Creating order…" : "Place order — payment later"}</button><p className="payment-note"><LockKeyhole />You will not be charged. Paystack processing is intentionally on hold.</p></form>}</div>{!orderNumber && <aside className="order-summary checkout-summary"><h2>Your order</h2>{cart.map((item) => <div className="checkout-line" key={`${item.product.id}-${item.option}`}><span>{item.product.name} × {item.quantity}<small>{item.option}</small></span><strong>{formatNaira(item.product.priceKobo * item.quantity)}</strong></div>)}<div><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div><div><span>Delivery</span><strong>{formatNaira(delivery)}</strong></div><div className="summary-total"><span>Total</span><strong>{formatNaira(subtotal + delivery)}</strong></div></aside>}</section></main>;
}

"use client";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { Header } from "@/components/Header";
import { useCommerce } from "@/components/CommerceProvider";
import { formatNaira } from "@/lib/product-types";

export function CheckoutForm() {
  const { cart, subtotal } = useCommerce();
  const [saved, setSaved] = useState(false);
  const [location, setLocation] = useState("Lagos");
  const delivery = location === "Lagos" ? 350000 : 650000;
  if (!cart.length) return <main><Header /><section className="commerce-page"><div className="empty-state"><h1>Your bag is empty.</h1><p>Add a product before starting checkout.</p><Link className="primary-action" href="/shop">Shop the collection</Link></div></section></main>;
  return <main><Header /><section className="checkout-page"><div className="checkout-form"><p className="eyebrow purple">Secure checkout</p><h1>Where should we send it?</h1><p>Complete your delivery details. Online payment will be enabled after Paystack is connected.</p>{saved ? <div className="checkout-saved"><CheckCircle2 /><div><h2>Checkout details saved</h2><p>Your bag remains on this device. No charge has been made.</p></div></div> : <form onSubmit={(event) => { event.preventDefault(); setSaved(true); }}><fieldset><legend>Contact</legend><label>Email address<input required type="email" name="email" autoComplete="email" /></label><label>Phone number<input required type="tel" name="phone" autoComplete="tel" /></label></fieldset><fieldset><legend>Delivery address</legend><div className="form-grid"><label>First name<input required name="firstName" autoComplete="given-name" /></label><label>Last name<input required name="lastName" autoComplete="family-name" /></label></div><label>Street address<input required name="address" autoComplete="street-address" /></label><div className="form-grid"><label>City<input required name="city" autoComplete="address-level2" /></label><label>State<select value={location} onChange={(event) => setLocation(event.target.value)} name="state"><option>Lagos</option><option>Abuja</option><option>Rivers</option><option>Oyo</option><option value="Other">Other state</option></select></label></div><label>Delivery note <span>(optional)</span><textarea name="note" rows={3} /></label></fieldset><button className="primary-action" type="submit">Save checkout details</button><p className="payment-note"><LockKeyhole />You will not be charged. Paystack processing is intentionally on hold.</p></form>}</div><aside className="order-summary checkout-summary"><h2>Your order</h2>{cart.map((item) => <div className="checkout-line" key={`${item.product.id}-${item.option}`}><span>{item.product.name} × {item.quantity}<small>{item.option}</small></span><strong>{formatNaira(item.product.priceKobo * item.quantity)}</strong></div>)}<div><span>Subtotal</span><strong>{formatNaira(subtotal)}</strong></div><div><span>Delivery</span><strong>{formatNaira(delivery)}</strong></div><div className="summary-total"><span>Total</span><strong>{formatNaira(subtotal + delivery)}</strong></div></aside></section></main>;
}

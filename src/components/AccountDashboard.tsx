"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Package, ShoppingBag } from "lucide-react";
import { useCommerce } from "@/components/CommerceProvider";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/product-types";

type OrderSummary = { id: string; order_number: string; status: string; total_kobo: number; created_at: string };

export function AccountDashboard({ email, orders }: { email: string; orders: OrderSummary[] }) {
  const router = useRouter();
  const { cart, wishlist, cartCount } = useCommerce();
  async function signOut() { await createClient().auth.signOut(); router.replace("/"); router.refresh(); }

  return <div className="account-dashboard">
    <div className="account-heading"><p className="eyebrow purple">Your account</p><h1>Welcome to Duchess.</h1><p>Signed in as {email}</p></div>
    <div className="account-cards">
      <Link href="/cart"><ShoppingBag /><strong>Your bag</strong><span>{cartCount ? `${cartCount} item${cartCount === 1 ? "" : "s"}` : "Nothing added yet"}</span></Link>
      <Link href="/wishlist"><Heart /><strong>Wishlist</strong><span>{wishlist.length ? `${wishlist.length} saved product${wishlist.length === 1 ? "" : "s"}` : "Start your wishlist"}</span></Link>
      <div><Package /><strong>Orders</strong><span>{orders.length ? `${orders.length} recent order${orders.length === 1 ? "" : "s"}` : "No orders yet"}</span></div>
    </div>
    <div className="account-saved-grid">
      <section className="account-saved-section"><div className="account-section-head"><h2>Saved bag</h2><Link href="/cart">View bag</Link></div>{cart.length ? <div className="account-preview-list">{cart.slice(0,3).map((item) => <Link href={`/products/${item.product.slug}`} key={`${item.product.id}:${item.option}`}><span className="account-preview-image"><Image src={item.product.image} alt="" fill sizes="64px" /></span><span><strong>{item.product.name}</strong><small>{item.option} · Qty {item.quantity}</small></span><b>{formatNaira(item.product.priceKobo * item.quantity)}</b></Link>)}</div> : <p>Your bag is empty. Products you add will appear here.</p>}</section>
      <section className="account-saved-section"><div className="account-section-head"><h2>Wishlist</h2><Link href="/wishlist">View wishlist</Link></div>{wishlist.length ? <div className="account-preview-list">{wishlist.slice(0,3).map((product) => <Link href={`/products/${product.slug}`} key={product.id}><span className="account-preview-image"><Image src={product.image} alt="" fill sizes="64px" /></span><span><strong>{product.name}</strong><small>{product.category}</small></span><b>{formatNaira(product.priceKobo)}</b></Link>)}</div> : <p>Products you save with the heart button will appear here.</p>}</section>
    </div>
    {orders.length > 0 && <section className="account-orders"><h2>Recent orders</h2>{orders.map((order) => <article key={order.id}><div><strong>{order.order_number}</strong><span>{new Date(order.created_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}</span></div><span className="order-status">{order.status.replaceAll("_", " ")}</span><strong>{formatNaira(order.total_kobo)}</strong></article>)}</section>}
    <div className="account-footer"><Link className="primary-action" href="/shop">Continue shopping</Link><button className="secondary-action" type="button" onClick={signOut}><LogOut />Sign out</button></div>
  </div>;
}

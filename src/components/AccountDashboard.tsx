"use client";
import Link from "next/link";
import { Heart, LogOut, Package, ShoppingBag } from "lucide-react";
import { useCommerce } from "@/components/CommerceProvider";
import { createClient } from "@/lib/supabase/client";
import { formatNaira } from "@/lib/product-types";

type OrderSummary = { id: string; order_number: string; status: string; total_kobo: number; created_at: string };
export function AccountDashboard({ email, orders }: { email: string; orders: OrderSummary[] }) {
  const { wishlist, cartCount } = useCommerce();
  async function signOut() { await createClient().auth.signOut(); window.location.assign("/"); }
  return <div className="account-dashboard"><div className="account-heading"><div><p className="eyebrow purple">Your account</p><h1>Welcome to Duchess.</h1><p>Signed in as {email}</p></div><button className="secondary-action" onClick={signOut}><LogOut />Sign out</button></div><div className="account-cards"><Link href="/cart"><ShoppingBag /><strong>Your bag</strong><span>{cartCount ? `${cartCount} item${cartCount === 1 ? "" : "s"}` : "Nothing added yet"}</span></Link><Link href="/shop"><Heart /><strong>Saved pieces</strong><span>{wishlist.length ? `${wishlist.length} favourite${wishlist.length === 1 ? "" : "s"}` : "Start your wishlist"}</span></Link><div><Package /><strong>Orders</strong><span>{orders.length ? `${orders.length} recent order${orders.length === 1 ? "" : "s"}` : "No orders yet"}</span></div></div>{orders.length > 0 && <section className="account-orders"><h2>Recent orders</h2>{orders.map((order) => <article key={order.id}><div><strong>{order.order_number}</strong><span>{new Date(order.created_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}</span></div><span className="order-status">{order.status.replaceAll("_", " ")}</span><strong>{formatNaira(order.total_kobo)}</strong></article>)}</section>}<Link className="primary-action" href="/shop">Continue shopping</Link></div>;
}

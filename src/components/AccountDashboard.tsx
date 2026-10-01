"use client";
import Link from "next/link";
import { Heart, LogOut, Package, ShoppingBag } from "lucide-react";
import { useCommerce } from "@/components/CommerceProvider";
import { createClient } from "@/lib/supabase/client";

export function AccountDashboard({ email }: { email: string }) {
  const { wishlist, cartCount } = useCommerce();
  async function signOut() { await createClient().auth.signOut(); window.location.assign("/"); }
  return <div className="account-dashboard"><div className="account-heading"><div><p className="eyebrow purple">Your account</p><h1>Welcome to Duchess.</h1><p>Signed in as {email}</p></div><button className="secondary-action" onClick={signOut}><LogOut />Sign out</button></div><div className="account-cards"><Link href="/cart"><ShoppingBag /><strong>Your bag</strong><span>{cartCount ? `${cartCount} item${cartCount === 1 ? "" : "s"}` : "Nothing added yet"}</span></Link><Link href="/shop"><Heart /><strong>Saved pieces</strong><span>{wishlist.length ? `${wishlist.length} favourite${wishlist.length === 1 ? "" : "s"}` : "Start your wishlist"}</span></Link><div><Package /><strong>Orders</strong><span>Your confirmed orders will appear here</span></div></div><Link className="primary-action" href="/shop">Continue shopping</Link></div>;
}

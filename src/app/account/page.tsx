import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/login");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");
  return <main className="account-shell"><Link className="auth-wordmark" href="/">Duchess</Link><div><p className="eyebrow purple">Your account</p><h1>Welcome to Duchess.</h1><p>Your saved pieces and orders will live here.</p><Link className="button button-dark" href="/hair">Continue shopping</Link></div></main>;
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountDashboard } from "@/components/AccountDashboard";

export default async function AccountPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/login");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");
  return <main className="account-shell"><Link className="auth-wordmark" href="/">Duchess</Link><AccountDashboard email={String(data.claims.email ?? "your account")} /></main>;
}

"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export function PasswordResetForm() {
  const [message,setMessage]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault(); const form=new FormData(event.currentTarget); const {error}=await createClient().auth.resetPasswordForEmail(String(form.get("email")),{redirectTo:`${window.location.origin}/auth/callback?next=/account`}); setMessage(error?.message ?? "Check your inbox for a secure password reset link.");}
  return <main className="auth-shell"><div className="auth-visual auth-visual-care" /><div className="auth-card"><Link className="auth-wordmark" href="/">Duchess</Link><p className="eyebrow purple">Account recovery</p><h1>Reset your password.</h1><p className="auth-intro">Enter the email attached to your Duchess account.</p><form className="auth-form" onSubmit={submit}><label htmlFor="reset-email">Email address</label><input id="reset-email" name="email" type="email" required autoComplete="email"/><button className="auth-submit">Send reset link</button></form>{message && <p className="auth-message" role="status">{message}</p>}<p className="auth-switch"><Link href="/login">Back to sign in</Link></p></div></main>;
}

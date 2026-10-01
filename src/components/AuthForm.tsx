"use client";

import Link from "next/link";
import { Chrome, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isLogin = mode === "login";

  async function continueWithGoogle() {
    if (!isSupabaseConfigured()) return setMessage("Authentication is being connected. Please check back shortly.");
    setLoading(true); setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` } });
    if (error) { setMessage(error.message); setLoading(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSupabaseConfigured()) return setMessage("Authentication is being connected. Please check back shortly.");
    setLoading(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = createClient();
    const result = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/account` } });
    if (result.error) setMessage(result.error.message);
    else if (isLogin) window.location.assign("/account");
    else setMessage("Check your inbox to confirm your Duchess account.");
    setLoading(false);
  }

  return (
    <div className="auth-card">
      <Link className="auth-wordmark" href="/">Duchess</Link>
      <p className="eyebrow purple">{isLogin ? "Welcome back" : "Join the private list"}</p>
      <h1>{isLogin ? "Sign in to your account." : "Create your Duchess account."}</h1>
      <p className="auth-intro">Save favourites, follow orders and enjoy a faster checkout.</p>
      <button className="google-button" type="button" onClick={continueWithGoogle} disabled={loading}><Chrome /> Continue with Google</button>
      <div className="auth-divider"><span>or continue with email</span></div>
      <form className="auth-form" onSubmit={submit}>
        <label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
        <label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} minLength={8} required placeholder="At least 8 characters" />
        {isLogin && <Link className="forgot-link" href="/forgot-password">Forgot password?</Link>}
        <button className="auth-submit" disabled={loading}>{loading && <LoaderCircle className="spinner" />}{isLogin ? "Sign in" : "Create account"}</button>
      </form>
      {message && <p className="auth-message" role="status">{message}</p>}
      <p className="auth-switch">{isLogin ? "New to Duchess?" : "Already have an account?"} <Link href={isLogin ? "/signup" : "/login"}>{isLogin ? "Create account" : "Sign in"}</Link></p>
      <Link className="auth-back" href="/">← Back to the collections</Link>
    </div>
  );
}

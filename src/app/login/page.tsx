import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Sign in | Duchess" };
export default function LoginPage() { return <main className="auth-shell"><div className="auth-visual auth-visual-hair" /><AuthForm mode="login" /></main>; }

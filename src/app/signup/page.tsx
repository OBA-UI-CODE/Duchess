import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Create account | Duchess" };
export default function SignupPage() { return <main className="auth-shell"><div className="auth-visual auth-visual-care" /><AuthForm mode="signup" /></main>; }

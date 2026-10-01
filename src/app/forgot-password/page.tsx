import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/PasswordResetForm";
export const metadata: Metadata = { title: "Reset password" };
export default function ForgotPasswordPage(){ return <PasswordResetForm />; }

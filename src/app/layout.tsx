import type { Metadata } from "next";
import "./globals.css";
import { CommerceProvider } from "@/components/CommerceProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://duchess-eight.vercel.app"),
  title: "Duchess — Hair, care & beauty",
  description:
    "Shop wigs, attachments, lashes, hair care and cosmetics chosen for every expression of you.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><CommerceProvider>{children}</CommerceProvider></body>
    </html>
  );
}

import type { Metadata } from "next";
import { StoreLanding } from "@/components/StoreLanding";

export const metadata: Metadata = { title: "Hair & Accessories | Duchess", description: "Shop Duchess wigs, bundles, attachments and premium hair accessories." };

export default function HairPage() { return <StoreLanding department="hair" />; }

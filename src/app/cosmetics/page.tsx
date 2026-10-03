import type { Metadata } from "next";
import { StoreLanding } from "@/components/StoreLanding";

export const metadata: Metadata = { title: "Hair Care & Cosmetics | Duchess", description: "Shop Duchess hair care, treatments, lashes and beauty essentials." };

export default function CosmeticsPage() { return <StoreLanding department="cosmetics" />; }

import type { Metadata } from "next";
import { Catalogue } from "@/components/Catalogue";
import { Header } from "@/components/Header";
import { getProducts } from "@/lib/products";
export const metadata: Metadata = { title: "Shop all", description: "Explore every Duchess hair and beauty product." };
export default async function ShopPage() { const products = await getProducts(); return <main><Header /><section className="catalogue-page"><p className="eyebrow purple">The full collection</p><h1>Find your next favourite.</h1><p>Premium hair, thoughtful care and beauty finishing touches—all in one place.</p><Catalogue products={products} /></section></main>; }

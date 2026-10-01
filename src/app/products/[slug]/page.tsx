import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, PackageCheck, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductPurchase } from "@/components/ProductPurchase";
import { formatNaira, getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product ? { title: product.name, description: product.description } : { title: "Product not found" };
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  return <main><Header department={product.department} /><section className="product-detail">
    <div className="detail-image"><Image src={product.image} alt={product.name} fill priority sizes="(min-width: 900px) 55vw, 100vw" /></div>
    <div className="detail-copy"><Link className="back-link" href={`/${product.department}`}><ChevronLeft />Back to {product.department === "hair" ? "hair" : "care"}</Link><p className="eyebrow purple">{product.category}</p><h1>{product.name}</h1><p className="detail-price">{formatNaira(product.priceKobo)}</p><p className="detail-description">{product.description}</p><ProductPurchase product={product} /><div className="detail-benefits"><span><PackageCheck />Nationwide delivery</span><span><ShieldCheck />Secure checkout</span></div></div>
  </section></main>;
}

import type { MetadataRoute } from "next";
import { sampleProducts } from "@/lib/products";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://duchess-eight.vercel.app"; const routes = ["","/hair","/cosmetics","/shop","/login","/signup","/shipping-returns","/privacy","/terms"]; return [...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })), ...sampleProducts.map((product) => ({ url: `${base}/products/${product.slug}`, lastModified: new Date() }))]; }

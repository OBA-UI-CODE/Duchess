import type { MetadataRoute } from "next";
import { sampleProducts } from "@/lib/products";
import { collections } from "@/lib/collections";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://duchess-eight.vercel.app"; const routes = ["","/hair","/cosmetics","/shop","/new-arrivals","/journal","/wishlist","/collections/hair","/collections/cosmetics","/login","/signup","/shipping-returns","/privacy","/terms"]; return [...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })), ...collections.map((collection) => ({ url: `${base}/collections/${collection.slug}`, lastModified: new Date() })), ...sampleProducts.map((product) => ({ url: `${base}/products/${product.slug}`, lastModified: new Date() }))]; }

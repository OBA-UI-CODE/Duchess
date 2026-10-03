import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "New arrivals",
  description: "Meet the latest additions to the Duchess hair and beauty collection.",
};

export default async function NewArrivalsPage() {
  const products = (await getProducts()).filter((product) => product.badge?.toLowerCase() === "new");

  return (
    <main>
      <Header />
      <section className="catalogue-page" aria-labelledby="arrivals-title">
        <p className="eyebrow purple">Just added</p>
        <h1 id="arrivals-title">New arrivals.</h1>
        <p>Fresh finds from across hair, care and cosmetics. Explore the latest additions to the Duchess collection.</p>
        {products.length ? (
          <div className="product-grid arrivals-grid">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="arrivals-empty">
            <h2>New pieces are on their way.</h2>
            <p>There are no new arrivals to show right now. Browse the full collection while you wait.</p>
          </div>
        )}
        <Link className="text-link arrivals-back" href="/shop">Shop all products <ArrowRight aria-hidden="true" /></Link>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import { useCommerce } from "@/components/CommerceProvider";

export function WishlistView() {
  const { wishlist } = useCommerce();
  return <main>
    <Header />
    <section className="commerce-page">
      <div className="page-intro"><p className="eyebrow purple">Your saved pieces</p><h1>Wishlist</h1><p>Keep the products you love in one place.</p></div>
      {wishlist.length ? <div className="product-grid">{wishlist.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><Heart /><h2>Nothing saved yet.</h2><p>Tap the heart on any product to find it here later.</p><Link className="primary-action" href="/shop">Explore products</Link></div>}
    </section>
  </main>;
}

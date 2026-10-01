"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { useCommerce } from "@/components/CommerceProvider";
import { formatNaira, type Product } from "@/lib/product-types";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCommerce();
  const [added, setAdded] = useState(false);
  const saved = isWishlisted(product.id);
  function add() { addToCart(product); setAdded(true); window.setTimeout(() => setAdded(false), 1400); }
  const needsChoice = Boolean(product.options?.length);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`}><Image src={product.image} alt={product.name} fill sizes="(min-width: 1100px) 25vw, (min-width: 600px) 33vw, 50vw" /></Link>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className={`wishlist ${saved ? "is-saved" : ""}`} onClick={() => toggleWishlist(product)} aria-label={`${saved ? "Remove" : "Save"} ${product.name}`} aria-pressed={saved}><Heart /></button>
      </div>
      <div className="product-copy">
        <p className="eyebrow">{product.category}</p>
        <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3>
        <div className="product-row">
          <p>{formatNaira(product.priceKobo)}</p>
          {needsChoice ? <Link className="quick-action" href={`/products/${product.slug}`} aria-label={`Choose options for ${product.name}`}><Plus /></Link> : <button onClick={add} aria-label={`Add ${product.name} to bag`}>{added ? <Check /> : <Plus />}</button>}
        </div>
      </div>
    </article>
  );
}

"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCommerce } from "@/components/CommerceProvider";
import type { Product } from "@/lib/product-types";

export function ProductPurchase({ product }: { product: Product }) {
  const [option, setOption] = useState(product.options?.[0] ?? "Standard");
  const [added, setAdded] = useState(false);
  const { addToCart, toggleWishlist, isWishlisted } = useCommerce();
  const saved = isWishlisted(product.id);
  return <div className="purchase-panel">
    {product.options && product.options.length > 0 && <fieldset><legend>Choose an option</legend><div className="option-list">{product.options.map((item) => <button type="button" className={item === option ? "is-selected" : ""} onClick={() => setOption(item)} key={item}>{item}</button>)}</div></fieldset>}
    <p className="stock-note">{product.stock > 0 ? `In stock — ${product.stock} available` : "Currently unavailable"}</p>
    <button className="primary-action" disabled={product.stock < 1} onClick={() => { addToCart(product, option); setAdded(true); window.setTimeout(() => setAdded(false), 1500); }}><ShoppingBag />{added ? "Added to bag" : "Add to bag"}</button>
    <button className="secondary-action" onClick={() => toggleWishlist(product)} aria-pressed={saved}><Heart />{saved ? "Saved to wishlist" : "Save to wishlist"}</button>
  </div>;
}

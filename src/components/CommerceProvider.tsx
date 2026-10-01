"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { calculateSubtotal, type Product } from "@/lib/product-types";

export type CartItem = { product: Product; quantity: number; option: string };
type CommerceContextValue = {
  cart: CartItem[]; wishlist: Product[]; cartCount: number; subtotal: number;
  addToCart: (product: Product, option?: string) => void;
  removeFromCart: (productId: string, option: string) => void;
  setQuantity: (productId: string, option: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearCart: () => void;
};
const CommerceContext = createContext<CommerceContextValue | null>(null);
const STORAGE_KEY = "duchess-commerce-v1";

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { const parsed = JSON.parse(saved) as { cart?: CartItem[]; wishlist?: Product[] }; setCart(parsed.cart ?? []); setWishlist(parsed.wishlist ?? []); }
    } catch { localStorage.removeItem(STORAGE_KEY); }
    finally { setReady(true); }
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist })); }, [cart, wishlist, ready]);

  const value = useMemo<CommerceContextValue>(() => ({
    cart, wishlist,
    cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: calculateSubtotal(cart.map((item) => ({ priceKobo: item.product.priceKobo, quantity: item.quantity }))),
    addToCart(product, option = product.options?.[0] ?? "Standard") {
      setCart((current) => {
        const found = current.find((item) => item.product.id === product.id && item.option === option);
        return found ? current.map((item) => item === found ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, option, quantity: 1 }];
      });
    },
    removeFromCart(productId, option) { setCart((current) => current.filter((item) => item.product.id !== productId || item.option !== option)); },
    setQuantity(productId, option, quantity) { setCart((current) => quantity < 1 ? current.filter((item) => item.product.id !== productId || item.option !== option) : current.map((item) => item.product.id === productId && item.option === option ? { ...item, quantity } : item)); },
    toggleWishlist(product) { setWishlist((current) => current.some((item) => item.id === product.id) ? current.filter((item) => item.id !== product.id) : [...current, product]); },
    isWishlisted(productId) { return wishlist.some((item) => item.id === productId); },
    clearCart() { setCart([]); },
  }), [cart, wishlist]);
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerce must be used within CommerceProvider");
  return context;
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { calculateSubtotal, type Product } from "@/lib/product-types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [remoteReady, setRemoteReady] = useState(false);
  const supabase = useMemo(() => isSupabaseConfigured() ? createClient() : null, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { const parsed = JSON.parse(saved) as { cart?: CartItem[]; wishlist?: Product[] }; setCart(parsed.cart ?? []); setWishlist(parsed.wishlist ?? []); }
    } catch { localStorage.removeItem(STORAGE_KEY); }
    finally { setReady(true); }
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, wishlist })); }, [cart, wishlist, ready]);

  useEffect(() => {
    if (!ready || !supabase) return;
    const client = supabase;
    let active = true;
    async function hydrateAccount() {
      const { data: { user } } = await client.auth.getUser();
      if (!active || !user) { setRemoteReady(false); setUserId(null); return; }
      setUserId(user.id);
      const [{ data: remoteCart }, { data: remoteWishlist }] = await Promise.all([
        client.from("cart_items").select("quantity,selected_option,products(*)"),
        client.from("wishlist_items").select("products(*)"),
      ]);
      if (!active) return;
      const mapProduct = (row: Record<string, unknown>): Product => ({
        id: String(row.id), slug: String(row.slug), name: String(row.name), department: row.department as Product["department"],
        category: String(row.category), description: String(row.description), priceKobo: Number(row.price_kobo),
        image: String(row.image_url), badge: row.badge ? String(row.badge) : undefined,
        options: Array.isArray(row.options) ? row.options.map(String) : undefined, stock: Number(row.stock_quantity),
      });
      setCart((local) => {
        const merged = new Map(local.map((item) => [`${item.product.id}:${item.option}`, item]));
        for (const row of remoteCart ?? []) {
          const productRow = row.products as unknown as Record<string, unknown> | null;
          if (productRow) merged.set(`${productRow.id}:${row.selected_option}`, { product: mapProduct(productRow), option: row.selected_option, quantity: row.quantity });
        }
        return [...merged.values()];
      });
      setWishlist((local) => {
        const merged = new Map(local.map((product) => [product.id, product]));
        for (const row of remoteWishlist ?? []) {
          const productRow = row.products as unknown as Record<string, unknown> | null;
          if (productRow) merged.set(String(productRow.id), mapProduct(productRow));
        }
        return [...merged.values()];
      });
      setRemoteReady(true);
    }
    void hydrateAccount();
    const { data: listener } = client.auth.onAuthStateChange(() => void hydrateAccount());
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [ready, supabase]);

  useEffect(() => {
    if (!supabase || !userId || !remoteReady) return;
    const timer = window.setTimeout(async () => {
      await supabase.from("cart_items").delete().eq("user_id", userId);
      if (cart.length) await supabase.from("cart_items").insert(cart.map((item) => ({ user_id: userId, product_id: item.product.id, selected_option: item.option, quantity: item.quantity })));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [cart, remoteReady, supabase, userId]);

  useEffect(() => {
    if (!supabase || !userId || !remoteReady) return;
    const timer = window.setTimeout(async () => {
      await supabase.from("wishlist_items").delete().eq("user_id", userId);
      if (wishlist.length) await supabase.from("wishlist_items").insert(wishlist.map((product) => ({ user_id: userId, product_id: product.id })));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [remoteReady, supabase, userId, wishlist]);

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

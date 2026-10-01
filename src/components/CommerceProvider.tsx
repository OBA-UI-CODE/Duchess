"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { calculateSubtotal, type Product } from "@/lib/product-types";
import { guestTransferFor, mergeAccountCommerce } from "@/lib/commerce-ownership";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type CartItem = { product: Product; quantity: number; option: string };
type GuestStore = { cart: CartItem[]; wishlist: Product[] };
type CommerceContextValue = {
  cart: CartItem[];
  wishlist: Product[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, option?: string) => void;
  removeFromCart: (productId: string, option: string) => void;
  setQuantity: (productId: string, option: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearCart: () => void;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);
const GUEST_KEY = "duchess-guest-commerce-v2";
// The previous key mixed anonymous and signed-in data. Never import it.
const LEGACY_KEY = "duchess-commerce-v1";

function readGuestStore(): GuestStore {
  try {
    const saved = localStorage.getItem(GUEST_KEY);
    if (!saved) return { cart: [], wishlist: [] };
    const parsed = JSON.parse(saved) as Partial<GuestStore>;
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
    };
  } catch {
    localStorage.removeItem(GUEST_KEY);
    return { cart: [], wishlist: [] };
  }
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id), slug: String(row.slug), name: String(row.name),
    department: row.department as Product["department"], category: String(row.category),
    description: String(row.description), priceKobo: Number(row.price_kobo),
    image: String(row.image_url), badge: row.badge ? String(row.badge) : undefined,
    options: Array.isArray(row.options) ? row.options.map(String) : undefined,
    stock: Number(row.stock_quantity),
  };
}

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [owner, setOwner] = useState<string | null>(null);
  const ownerRef = useRef<string | null>(null);
  const loadId = useRef(0);
  const [ready, setReady] = useState(false);
  const client = useMemo(() => isSupabaseConfigured() ? createClient() : null, []);

  useEffect(() => {
    localStorage.removeItem(LEGACY_KEY);
    if (!client) {
      queueMicrotask(() => {
        const guest = readGuestStore();
        ownerRef.current = "guest";
        setOwner("guest"); setCart(guest.cart); setWishlist(guest.wishlist); setReady(true);
      });
      return;
    }

    let active = true;
    async function loadAccount() {
      const currentLoad = ++loadId.current;
      const { data: { user } } = await client!.auth.getUser();
      if (!active || currentLoad !== loadId.current) return;
      const nextOwner = user?.id ?? "guest";
      if (nextOwner === ownerRef.current) return;
      const previousOwner = ownerRef.current;
      ownerRef.current = nextOwner;
      setOwner(nextOwner);
      setReady(false);
      setCart([]);
      setWishlist([]);

      if (!user) {
        // Logout must not turn the former account's cart into a guest cart.
        if (previousOwner && previousOwner !== "guest") localStorage.removeItem(GUEST_KEY);
        const guest = readGuestStore();
        setCart(guest.cart); setWishlist(guest.wishlist); setReady(true);
        return;
      }

      const [{ data: remoteCart, error: cartError }, { data: remoteWishlist, error: wishlistError }] = await Promise.all([
        client!.from("cart_items").select("quantity,selected_option,products(*)"),
        client!.from("wishlist_items").select("products(*)"),
      ]);
      if (!active || currentLoad !== loadId.current) return;
      if (cartError || wishlistError) return;

      const accountCart: CartItem[] = (remoteCart ?? []).flatMap((row) => {
        const product = row.products as unknown as Record<string, unknown> | null;
        return product ? [{ product: mapProduct(product), option: row.selected_option, quantity: row.quantity }] : [];
      });
      const accountWishlist: Product[] = (remoteWishlist ?? []).flatMap((row) => {
        const product = row.products as unknown as Record<string, unknown> | null;
        return product ? [mapProduct(product)] : [];
      });

      // Only a genuinely anonymous basket may transfer into an account.
      const guest = guestTransferFor(previousOwner, readGuestStore());
      const merged = mergeAccountCommerce({ cart: accountCart, wishlist: accountWishlist }, guest);

      if (guest.cart.length || guest.wishlist.length) {
        await Promise.all([
          guest.cart.length ? client!.from("cart_items").upsert(guest.cart.filter((item) => !accountCart.some((saved) => saved.product.id === item.product.id && saved.option === item.option)).map((item) => ({ user_id: user.id, product_id: item.product.id, selected_option: item.option, quantity: item.quantity })), { onConflict: "user_id,product_id,selected_option" }) : Promise.resolve({ error: null }),
          guest.wishlist.length ? client!.from("wishlist_items").upsert(guest.wishlist.filter((product) => !accountWishlist.some((saved) => saved.id === product.id)).map((product) => ({ user_id: user.id, product_id: product.id })), { onConflict: "user_id,product_id" }) : Promise.resolve({ error: null }),
        ]);
        // The guest basket belongs to this login attempt; never offer it to a later account.
        localStorage.removeItem(GUEST_KEY);
      }
      if (!active || currentLoad !== loadId.current) return;
      setCart(merged.cart); setWishlist(merged.wishlist); setReady(true);
    }

    void loadAccount();
    const { data: listener } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        const announcedOwner = session?.user.id ?? "guest";
        if (announcedOwner !== ownerRef.current) {
          // Remove the previous shopper's items as soon as auth changes.
          setReady(false); setCart([]); setWishlist([]);
        }
        // Defer getUser until the auth callback has finished updating its session.
        window.setTimeout(() => void loadAccount(), 0);
      }
    });
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, [client]);

  useEffect(() => {
    if (!ready || owner !== "guest" || ownerRef.current !== "guest") return;
    localStorage.setItem(GUEST_KEY, JSON.stringify({ cart, wishlist }));
  }, [cart, wishlist, owner, ready]);

  useEffect(() => {
    if (!ready || !client || !owner || owner === "guest" || ownerRef.current !== owner) return;
    const timer = window.setTimeout(async () => {
      if (ownerRef.current !== owner) return;
      const { data: { user } } = await client.auth.getUser();
      if (user?.id !== owner || ownerRef.current !== owner) return;
      const { data: savedCart, error } = await client.from("cart_items").select("product_id,selected_option");
      if (error || ownerRef.current !== owner) return;
      const wanted = new Set(cart.map((item) => `${item.product.id}:${item.option}`));
      for (const item of savedCart ?? []) {
        if (!wanted.has(`${item.product_id}:${item.selected_option}`)) {
          await client.from("cart_items").delete().eq("user_id", owner).eq("product_id", item.product_id).eq("selected_option", item.selected_option);
        }
      }
      if (cart.length && ownerRef.current === owner) await client.from("cart_items").upsert(cart.map((item) => ({ user_id: owner, product_id: item.product.id, selected_option: item.option, quantity: item.quantity })), { onConflict: "user_id,product_id,selected_option" });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [cart, client, owner, ready]);

  useEffect(() => {
    if (!ready || !client || !owner || owner === "guest" || ownerRef.current !== owner) return;
    const timer = window.setTimeout(async () => {
      if (ownerRef.current !== owner) return;
      const { data: { user } } = await client.auth.getUser();
      if (user?.id !== owner || ownerRef.current !== owner) return;
      const { data: savedWishlist, error } = await client.from("wishlist_items").select("product_id");
      if (error || ownerRef.current !== owner) return;
      const wanted = new Set(wishlist.map((product) => product.id));
      for (const item of savedWishlist ?? []) {
        if (!wanted.has(item.product_id)) await client.from("wishlist_items").delete().eq("user_id", owner).eq("product_id", item.product_id);
      }
      if (wishlist.length && ownerRef.current === owner) await client.from("wishlist_items").upsert(wishlist.map((product) => ({ user_id: owner, product_id: product.id })), { onConflict: "user_id,product_id" });
    }, 350);
    return () => window.clearTimeout(timer);
  }, [client, owner, ready, wishlist]);

  const value = useMemo<CommerceContextValue>(() => ({
    cart, wishlist,
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
    subtotal: calculateSubtotal(cart.map((item) => ({ priceKobo: item.product.priceKobo, quantity: item.quantity }))),
    addToCart(product, option = product.options?.[0] ?? "Standard") {
      setCart((current) => {
        const existing = current.find((item) => item.product.id === product.id && item.option === option);
        return existing ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, option, quantity: 1 }];
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

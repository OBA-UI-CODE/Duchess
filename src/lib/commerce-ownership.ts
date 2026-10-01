import type { Product } from "./product-types.ts";

export type StoredCartItem = { product: Product; quantity: number; option: string };
export type StoredCommerce = { cart: StoredCartItem[]; wishlist: Product[] };

export function guestTransferFor(previousOwner: string | null, guest: StoredCommerce): StoredCommerce {
  return previousOwner === null || previousOwner === "guest" ? guest : { cart: [], wishlist: [] };
}

export function mergeAccountCommerce(account: StoredCommerce, guest: StoredCommerce): StoredCommerce {
  const cart = new Map(account.cart.map((item) => [`${item.product.id}:${item.option}`, item]));
  for (const item of guest.cart) {
    const key = `${item.product.id}:${item.option}`;
    if (!cart.has(key)) cart.set(key, item);
  }
  const wishlist = new Map(account.wishlist.map((product) => [product.id, product]));
  for (const product of guest.wishlist) if (!wishlist.has(product.id)) wishlist.set(product.id, product);
  return { cart: [...cart.values()], wishlist: [...wishlist.values()] };
}

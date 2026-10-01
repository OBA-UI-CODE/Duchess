import assert from "node:assert/strict";
import test from "node:test";
import { guestTransferFor, mergeAccountCommerce, type StoredCommerce } from "./commerce-ownership.ts";
import type { Product } from "./product-types.ts";

const product: Product = { id: "product-1", slug: "sample", name: "Sample", department: "hair", category: "Wig", description: "Sample", priceKobo: 10000, image: "/sample.png", stock: 5 };
const previousCart: StoredCommerce = { cart: [{ product, option: "Standard", quantity: 2 }], wishlist: [product] };
const empty: StoredCommerce = { cart: [], wishlist: [] };

test("switching from account A to B cannot transfer A's cart or wishlist", () => {
  const transfer = guestTransferFor("account-a", previousCart);
  assert.deepEqual(mergeAccountCommerce(empty, transfer), empty);
});

test("anonymous items transfer once when a guest signs in", () => {
  const transfer = guestTransferFor("guest", previousCart);
  assert.deepEqual(mergeAccountCommerce(empty, transfer), previousCart);
});

test("remote account data wins over duplicate guest items", () => {
  const account = { cart: [{ product, option: "Standard", quantity: 4 }], wishlist: [product] };
  assert.deepEqual(mergeAccountCommerce(account, previousCart), account);
});

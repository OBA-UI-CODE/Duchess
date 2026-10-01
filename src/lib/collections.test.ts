import assert from "node:assert/strict";
import test from "node:test";
import { collections, getCollectionProducts, getDepartmentCollections } from "./collections.ts";
import type { Product } from "./product-types.ts";

test("men's hair and care remain in their respective departments", () => {
  const hair = getDepartmentCollections("hair");
  const cosmetics = getDepartmentCollections("cosmetics");
  assert.ok(hair.some((collection) => collection.slug === "mens-hair"));
  assert.ok(cosmetics.some((collection) => collection.slug === "mens-hair-care"));
  assert.ok(!hair.some((collection) => collection.slug === "mens-hair-care"));
});

test("a collection returns only its listed products in display order", () => {
  const collection = collections.find((item) => item.slug === "mens-hair");
  assert.ok(collection);
  const product = (slug: string) => ({ slug } as Product);
  const products = [product("atlas-salt-pepper-system"), product("amara-body-wave"), product("kairo-textured-hair-system")];
  assert.deepEqual(getCollectionProducts(products, collection).map((item) => item.slug), [
    "kairo-textured-hair-system",
    "atlas-salt-pepper-system",
  ]);
});

test("men's collections each contain two complete rows of distinct products", () => {
  for (const slug of ["mens-hair", "mens-hair-care"]) {
    const collection = collections.find((item) => item.slug === slug);
    assert.ok(collection);
    assert.equal(collection.productSlugs.length, 6);
    assert.equal(new Set(collection.productSlugs).size, 6);
  }
});

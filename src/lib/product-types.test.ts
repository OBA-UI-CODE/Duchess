import assert from "node:assert/strict";
import test from "node:test";
import { calculateSubtotal, formatNaira } from "./product-types.ts";

test("calculates an order subtotal in integer kobo", () => {
  assert.equal(calculateSubtotal([
    { priceKobo: 1_850_000, quantity: 2 },
    { priceKobo: 900_000, quantity: 1 },
  ]), 4_600_000);
});

test("formats integer kobo as Nigerian naira", () => {
  assert.match(formatNaira(1_250_000), /12,500/);
});

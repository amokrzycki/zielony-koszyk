import { describe, expect, it } from "vitest";
import { addItem, cartSlice } from "../components/Cart/cartSlice.ts";
import { type CartState, normalizeCart } from "./cartReducers.ts";

const empty: CartState = { items: [], totalAmount: 0 };
const reduce = (state: CartState, action: ReturnType<typeof addItem>) => cartSlice.reducer(state, action);

describe("cart prices", () => {
  it("coerces an API string price to a number when adding to the cart", () => {
    // The API serialises decimals as strings; the Product/CartItem types claim number.
    const state = reduce(
      empty,
      addItem({ productId: 1, name: "Pomidor", quantity: 2, price: "12.50" as unknown as number }),
    );

    expect(state.items[0].price).toBe(12.5);
    expect(() => state.items[0].price.toFixed(2)).not.toThrow();
  });

  it("merges quantity for an existing product", () => {
    let state = reduce(empty, addItem({ productId: 1, name: "Pomidor", quantity: 1, price: 12.5 }));
    state = reduce(state, addItem({ productId: 1, name: "Pomidor", quantity: 3, price: 12.5 }));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(4);
  });

  it("normalises string prices in carts persisted by older versions", () => {
    const persisted: CartState = {
      items: [{ productId: 1, name: "Oliwa", quantity: 1, price: "5.50" as unknown as number }],
      totalAmount: 0,
    };

    expect(normalizeCart(persisted).items[0].price).toBe(5.5);
    expect(persisted.items[0].price).toBe("5.50");
  });
});

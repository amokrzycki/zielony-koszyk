import type { PayloadAction } from "@reduxjs/toolkit";
import type CartItem from "../types/CartItem.ts";

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

/** Flat courier fee in PLN; the backend adds the matching delivery line to every order. */
export const DELIVERY_FEE = 10;

// The API serialises decimals as strings; CartItem.price is a number.
const toPrice = (price: unknown): number => Number(price);

/** Re-coerce persisted cart prices, which may predate the addItem fix. */
export const normalizeCart = (cart: CartState): CartState => ({
  ...cart,
  items: cart.items.map((item) => ({ ...item, price: toPrice(item.price) })),
});

export const cartReducers = {
  addItem(state: CartState, action: PayloadAction<CartItem>) {
    const item = { ...action.payload, price: toPrice(action.payload.price) };
    const existingItem = state.items.find((existing) => existing.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      state.items.push(item);
    }
  },
  removeItem(state: CartState, action: PayloadAction<number>) {
    state.items = state.items.filter((item) => item.productId !== action.payload);
  },
  changeQuantity(state: CartState, action: PayloadAction<{ productId: number; quantity: number }>) {
    const item = state.items.find((item) => item.productId === action.payload.productId);
    if (item) {
      item.quantity = action.payload.quantity;
    }
  },
  calculateTotalAmount(state: CartState) {
    state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0) + DELIVERY_FEE;
  },
  clearCart: () => initialState,
};

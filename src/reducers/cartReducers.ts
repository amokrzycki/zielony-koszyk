import { PayloadAction } from "@reduxjs/toolkit";
import CartItem from "../types/CartItem.ts";

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

export const cartReducers = {
  addItem(state: CartState, action: PayloadAction<CartItem>) {
    const existingItem = state.items.find(
      (item) => item.productId === action.payload.productId,
    );
    if (existingItem) {
      existingItem.quantity += action.payload.quantity;
    } else {
      state.items.push({ ...action.payload });
    }
  },
  removeItem(state: CartState, action: PayloadAction<number>) {
    state.items = state.items.filter(
      (item) => item.productId !== action.payload,
    );
  },
  changeQuantity(
    state: CartState,
    action: PayloadAction<{ productId: number; quantity: number }>,
  ) {
    const item = state.items.find(
      (item) => item.productId === action.payload.productId,
    );
    if (item) {
      item.quantity = action.payload.quantity;
    }
  },
  calculateTotalAmount(state: CartState) {
    state.totalAmount =
      state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ) + 10;
  },
  clearCart: () => initialState,
};

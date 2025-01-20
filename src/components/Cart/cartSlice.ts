import { cartReducers, CartState } from "@/reducers/cartReducers.ts";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: cartReducers,
});

export const {
  addItem,
  removeItem,
  changeQuantity,
  calculateTotalAmount,
  clearCart,
} = cartSlice.actions;

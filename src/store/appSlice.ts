import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CartItem from "../types/CartItem.ts";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const appSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (existingItem) {
        console.log(
          `Increasing quantity of productId=${action.payload.productId}`,
        );
        existingItem.quantity += action.payload.quantity;
      } else {
        console.log(
          `Adding new item with productId=${action.payload.productId}`,
        );
        state.items.push({ ...action.payload });
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
    },
    changeQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) {
      const item = state.items.find(
        (item) => item.productId === action.payload.productId,
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
});

export const { addItem, removeItem, changeQuantity } = appSlice.actions;

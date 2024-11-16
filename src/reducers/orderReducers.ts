import { Order } from "../types/Order.ts";
import { PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../components/Order/orderSlice.ts";

export interface OrderState {
  orderInfo: Order;
}

export const orderReducers = {
  setOrder(state: OrderState, action: PayloadAction<Order>) {
    state.orderInfo = action.payload;
  },
  clearOrder: () => initialState,
};

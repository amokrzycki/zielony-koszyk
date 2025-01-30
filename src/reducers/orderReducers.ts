import { CreateOrder } from "../types/CreateOrder.ts";
import { PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../components/Order/orderSlice.ts";
import { CreateAddress } from "@/types/CreateAddress.ts";
import { Address } from "@/types/Address.ts";

export interface OrderState {
  orderInfo: CreateOrder;
}

export const orderReducers = {
  setOrder(state: OrderState, action: PayloadAction<CreateOrder>) {
    state.orderInfo = action.payload;
  },
  setShippingAddress(
    state: OrderState,
    action: PayloadAction<CreateAddress | Address>,
  ) {
    state.orderInfo.shippingAddress = action.payload;
  },
  setBillingAddress(
    state: OrderState,
    action: PayloadAction<CreateAddress | Address>,
  ) {
    state.orderInfo.billingAddress = action.payload;
  },
  clearOrder: () => initialState,
};

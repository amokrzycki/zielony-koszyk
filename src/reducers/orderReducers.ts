import { CreateOrderDTO } from "../types/CreateOrderDTO.ts";
import { PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "../components/Order/orderSlice.ts";
import { Address } from "@/types/Address.ts";

export interface OrderState {
  orderInfo: CreateOrderDTO;
}

export const orderReducers = {
  setOrder(state: OrderState, action: PayloadAction<CreateOrderDTO>) {
    state.orderInfo = action.payload;
  },
  setShippingAddress(state: OrderState, action: PayloadAction<Address>) {
    state.orderInfo.shipping_address = action.payload;
  },
  setBillingAddress(state: OrderState, action: PayloadAction<Address>) {
    state.orderInfo.billing_address = action.payload;
  },
  setSameAddress(state: OrderState, action: PayloadAction<boolean>) {
    state.orderInfo.same_address = action.payload;
  },
  clearOrder: () => initialState,
};

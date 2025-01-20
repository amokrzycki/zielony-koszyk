import { orderReducers, OrderState } from "@/reducers/orderReducers.ts";
import { createSlice } from "@reduxjs/toolkit";
import { OrderType } from "@/enums/OrderType.ts";

export const initialState: OrderState = {
  orderInfo: {
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    order_type: OrderType.PRIVATE,
    orderDetails: [],
  },
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: orderReducers,
});

export const { setOrder, clearOrder } = orderSlice.actions;

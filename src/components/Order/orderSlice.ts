import { orderReducers, OrderState } from "../../reducers/orderReducers.ts";
import { OrderStatuses } from "../../enums/OrderStatuses.ts";
import { createSlice } from "@reduxjs/toolkit";

export const initialState: OrderState = {
  orderInfo: {
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    status: OrderStatuses.NEW,
    orderDetails: [],
  },
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: orderReducers,
});

export const { setOrder, clearOrder } = orderSlice.actions;

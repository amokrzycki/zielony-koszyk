import { orderReducers, OrderState } from "@/reducers/orderReducers.ts";
import { createSlice } from "@reduxjs/toolkit";
import { OrderType } from "@/enums/OrderType.ts";
import { AddressType } from "@/enums/AddressType.ts";
import { CustomerType } from "@/enums/CustomerType.ts";

export const initialState: OrderState = {
  orderInfo: {
    user_id: "",
    order_type: OrderType.PRIVATE,
    nip: "",
    customer_email: "",
    billing_address: {
      address_id: 0,
      first_name: "",
      last_name: "",
      company_name: "",
      nip: "",
      phone: "",
      type: AddressType.BILLING,
      customer_type: CustomerType.PERSON,
      default: false,
      street: "",
      building_number: "",
      flat_number: "",
      city: "",
      zip: "",
    },
    shipping_address: {
      address_id: 0,
      first_name: "",
      last_name: "",
      company_name: "",
      nip: "",
      phone: "",
      type: AddressType.DELIVERY,
      customer_type: CustomerType.PERSON,
      default: false,
      street: "",
      building_number: "",
      flat_number: "",
      city: "",
      zip: "",
    },
    same_address: true,
    orderDetails: [],
  },
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: orderReducers,
});

export const {
  setOrder,
  setBillingAddress,
  setShippingAddress,
  clearOrder,
  setSameAddress,
} = orderSlice.actions;

import { baseApi } from "../../api/api.ts";
import { Order } from "../../types/Order.ts";

export const orderApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body: Order) => ({
        url: "orders",
        method: "POST",
        body,
      }),
    }),
    getUserOrders: builder.query({
      query: (userId: string) => ({
        url: `orders/${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetUserOrdersQuery } = orderApiSlice;

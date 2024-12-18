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
        url: `orders/user-orders/${userId}`,
        method: "GET",
      }),
    }),
    getOrder: builder.query({
      query: (orderId: string) => ({
        url: `orders/order/${orderId}`,
        method: "GET",
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId: string) => ({
        url: `order-details/${orderId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderQuery,
  useGetOrderDetailsQuery,
} = orderApiSlice;

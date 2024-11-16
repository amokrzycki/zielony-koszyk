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
  }),
});

export const { useCreateOrderMutation } = orderApiSlice;

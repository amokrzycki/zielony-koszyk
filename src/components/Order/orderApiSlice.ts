import { baseApi } from "../../api/api.ts";
import { Order } from "../../types/Order.ts";
import { UserOrder } from "../../types/UserOrder.ts";

export const orderApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (body: Order) => ({
        url: "orders",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
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
    getOrders: builder.query<UserOrder[], void>({
      query: () => ({
        url: "orders",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ order_id }) => ({
                type: "Orders" as const,
                order_id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),
    getOrderDetails: builder.query({
      query: (orderId: string) => ({
        url: `order-details/${orderId}`,
        method: "GET",
      }),
    }),
    updateOrder: builder.mutation({
      query: (body: { id: number; order: Partial<UserOrder> }) => ({
        url: `orders/${body.id}`,
        method: "PUT",
        body: body.order,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
    deleteOrder: builder.mutation({
      query: (orderId: number) => ({
        url: `orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderQuery,
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApiSlice;

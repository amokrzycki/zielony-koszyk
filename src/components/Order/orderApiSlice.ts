import { baseApi } from "../../api/api.ts";
import { Order } from "../../types/Order.ts";
import { UserOrder } from "../../types/UserOrder.ts";
import { OrderItemResponse } from "../../types/OrderItemResponse.ts";

export const orderApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, Order>({
      query: (body: Order) => ({
        url: "orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
    getUserOrders: builder.query<UserOrder[], string>({
      query: (userId: string) => ({
        url: `orders/user-orders/${userId}`,
        method: "GET",
      }),
    }),
    getOrder: builder.query<UserOrder, string>({
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
              { type: "Orders" },
            ]
          : [{ type: "Orders" }],
    }),
    updateOrder: builder.mutation<
      OrderItemResponse,
      { id: number; order: Partial<UserOrder> }
    >({
      query: (body: { id: number; order: Partial<UserOrder> }) => ({
        url: `orders/${body.id}`,
        method: "PUT",
        body: body.order,
      }),
      invalidatesTags: [{ type: "Orders" }],
    }),
    deleteOrder: builder.mutation<OrderItemResponse, number>({
      query: (orderId: number) => ({
        url: `orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Orders" }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderQuery,
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApiSlice;

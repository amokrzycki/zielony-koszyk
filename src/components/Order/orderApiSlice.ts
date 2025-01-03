import { baseApi } from "../../api/api.ts";
import { Order } from "../../types/Order.ts";
import { UserOrder } from "../../types/UserOrder.ts";
import { OrderDetailsResponse } from "../../types/OrderDetailsResponse.ts";

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
    getUserOrders: builder.query<Order[], string>({
      query: (userId: string) => ({
        url: `orders/user-orders/${userId}`,
        method: "GET",
      }),
    }),
    getOrder: builder.query<Order, string>({
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
    getOrderItems: builder.query<OrderDetailsResponse[], string>({
      query: (orderId: string) => ({
        url: `order-items/${orderId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ order_item_id }) => ({
                type: "OrderItems" as const,
                order_item_id,
              })),
              { type: "OrderItems" },
            ]
          : [{ type: "OrderItems" }],
    }),
    updateOrderItems: builder.mutation<
      OrderDetailsResponse,
      { id: number; order: Partial<OrderDetailsResponse> }
    >({
      query: (body: { id: number; order: Partial<OrderDetailsResponse> }) => ({
        url: `order-items/${body.id}`,
        method: "PUT",
        body: body.order,
      }),
      invalidatesTags: [{ type: "OrderItems" }],
    }),
    removeOrderItems: builder.mutation<OrderDetailsResponse, number>({
      query: (orderId: number) => ({
        url: `order-items/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "OrderItems" }],
    }),
    updateOrder: builder.mutation<
      OrderDetailsResponse,
      { id: number; order: Partial<UserOrder> }
    >({
      query: (body: { id: number; order: Partial<UserOrder> }) => ({
        url: `orders/${body.id}`,
        method: "PUT",
        body: body.order,
      }),
      invalidatesTags: [{ type: "Orders" }],
    }),
    deleteOrder: builder.mutation<OrderDetailsResponse, number>({
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
  useGetOrderItemsQuery,
  useUpdateOrderItemsMutation,
  useRemoveOrderItemsMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApiSlice;

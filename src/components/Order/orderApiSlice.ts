import { baseApi } from "../../api/api.ts";
import { CreateOrderDTO } from "../../types/CreateOrderDTO.ts";
import { Order } from "../../types/Order.ts";
import { OrderItemResponse } from "../../types/OrderItemResponse.ts";

export const orderApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderDTO, CreateOrderDTO>({
      query: (body: CreateOrderDTO) => ({
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
    getOrders: builder.query<Order[], void>({
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
      { id: number; order: Partial<Order> }
    >({
      query: (body: { id: number; order: Partial<Order> }) => ({
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

import { baseApi } from "../../api/api.ts";
import { OrderItemResponse } from "../../types/OrderItemResponse.ts";
import { OrderItemCreate } from "../../types/OrderItemCreate.ts";

export const orderItemsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderItems: builder.query<OrderItemResponse[], string>({
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
    createOrderItems: builder.mutation<OrderItemCreate[], OrderItemCreate[]>({
      query: (order: OrderItemCreate[]) => ({
        url: `order-items`,
        method: "POST",
        body: order,
      }),
      invalidatesTags: [{ type: "OrderItems" }],
    }),
    updateOrderItems: builder.mutation<
      OrderItemResponse,
      { id: number; order: Partial<OrderItemResponse> }
    >({
      query: (body: { id: number; order: Partial<OrderItemResponse> }) => ({
        url: `order-items/${body.id}`,
        method: "PUT",
        body: body.order,
      }),
      invalidatesTags: ["OrderItems", { type: "Orders", id: "LIST" }],
    }),
    removeOrderItems: builder.mutation<OrderItemResponse, number>({
      query: (orderId: number) => ({
        url: `order-items/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "OrderItems" }],
    }),
  }),
});

export const {
  useGetOrderItemsQuery,
  useCreateOrderItemsMutation,
  useUpdateOrderItemsMutation,
  useRemoveOrderItemsMutation,
} = orderItemsApiSlice;

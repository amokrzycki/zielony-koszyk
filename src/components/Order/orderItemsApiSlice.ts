import { baseApi } from "../../api/api.ts";
import { OrderDetailsResponse } from "../../types/OrderDetailsResponse.ts";

// TODO: Refresh orders (price) list after deleting/updating order items

export const orderItemsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      invalidatesTags: ["OrderItems", { type: "Orders", id: "LIST" }],
    }),
    removeOrderItems: builder.mutation<OrderDetailsResponse, number>({
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
  useUpdateOrderItemsMutation,
  useRemoveOrderItemsMutation,
} = orderItemsApiSlice;

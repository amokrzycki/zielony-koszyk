import { baseApi } from "../../api/api.ts";
import Product from "../../types/Product.ts";

export const productsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => ({
        url: "products",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ product_id }) => ({
                type: "Products" as const,
                product_id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProductsByCategory: builder.query({
      query: (body: { category: string; name: string }) => ({
        url: `products/search/${body.category}`,
        params: { name: body.name },
        method: "GET",
      }),
    }),
    getProductsLikeName: builder.query({
      query: (name: string) => ({
        url: `products/search`,
        params: { name },
        method: "GET",
      }),
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (product: Partial<Product>) => ({
        url: `products`,
        method: "POST",
        body: product,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    deleteProduct: builder.mutation({
      query: (id: number) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: (body: { id: number; product: Partial<Product> }) => ({
        url: `products/${body.id}`,
        method: "PUT",
        body: body.product,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsLikeNameQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productsApiSlice;

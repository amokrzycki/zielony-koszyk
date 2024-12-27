import { baseApi } from "../../api/api.ts";

export const productsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: "products",
        method: "GET",
      }),
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
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsLikeNameQuery,
} = productsApiSlice;

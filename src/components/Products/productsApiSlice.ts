import { baseApi } from "@/api/api.ts";
import Product from "@/types/Product.ts";
import { ProductParams } from "@/types/ProductParams.ts";
import { PageableProducts } from "@/types/PageableProducts.ts";

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
    getProductById: builder.query<Product, number>({
      query: (id: number) => ({
        url: `products/${id}`,
        method: "GET",
      }),
    }),
    getProductsByParams: builder.query<PageableProducts, ProductParams>({
      query: (params) => ({
        url: `products/search`,
        params,
        method: "GET",
      }),
    }),
    createProduct: builder.mutation<
      Product,
      { product: Partial<Product>; file: File | null }
    >({
      query: ({ product, file }) => {
        const formData = new FormData();
        formData.append("product", JSON.stringify(product));

        if (file) {
          formData.append("file", file);
        }

        return {
          url: `products`,
          method: "POST",
          body: formData,
        };
      },
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
    uploadImage: builder.mutation<Product, { id: number; file: File }>({
      query: (body: { id: number; file: File }) => {
        const formData = new FormData();
        formData.append("file", body.file);
        return {
          url: `products/${body.id}/image`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByParamsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
} = productsApiSlice;

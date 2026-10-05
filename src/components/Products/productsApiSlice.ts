import { baseApi } from "@/api/api.ts";
import type Product from "@/types/Product.ts";
import type { ProductParams } from "@/types/ProductParams.ts";
import type { PageableProducts } from "@/types/PageableProducts.ts";
import type { CreateProductBody, ProductTranslations, UpdateProductBody } from "@/types/ProductTranslations.ts";
import type { Locale } from "@/i18n/locale.ts";

/**
 * Responses below change with the content language, so `locale` is part of each query's argument and therefore of its
 * RTK Query cache key: Polish and English results can never be served for one another. The same value feeds the
 * `Accept-Language` header, so the key and the request cannot disagree.
 */
interface Localized {
  locale: Locale;
}

const acceptLanguage = (locale: Locale) => ({ "Accept-Language": locale });

const productTags = (id: number) => ({ type: "Products" as const, id });
const LIST = { type: "Products" as const, id: "LIST" };

export const productsApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], Localized>({
      query: ({ locale }) => ({
        url: "products",
        method: "GET",
        headers: acceptLanguage(locale),
      }),
      providesTags: (result) => [...(result ?? []).map(({ product_id }) => productTags(product_id)), LIST],
    }),
    getProductById: builder.query<Product, Localized & { id: number }>({
      query: ({ id, locale }) => ({
        url: `products/${id}`,
        method: "GET",
        headers: acceptLanguage(locale),
      }),
      providesTags: (_result, _error, { id }) => [productTags(id)],
    }),
    getProductsByParams: builder.query<PageableProducts, ProductParams & Localized>({
      query: ({ locale, ...params }) => ({
        url: `products/search`,
        params,
        method: "GET",
        headers: acceptLanguage(locale),
      }),
      providesTags: (result) => [...(result?.data ?? []).map(({ product_id }) => productTags(product_id)), LIST],
    }),
    /** Admin editing: every language at once. Not localized, so no locale in the key. */
    getProductTranslations: builder.query<ProductTranslations, number>({
      query: (id) => ({
        url: `products/${id}/translations`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [productTags(id)],
    }),
    createProduct: builder.mutation<Product, { product: CreateProductBody; file: File | null }>({
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
      invalidatesTags: [LIST],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [productTags(id), LIST],
    }),
    updateProduct: builder.mutation<Product, { id: number; product: UpdateProductBody }>({
      query: (body) => ({
        url: `products/${body.id}`,
        method: "PUT",
        body: body.product,
      }),
      invalidatesTags: (_result, _error, { id }) => [productTags(id), LIST],
    }),
    uploadImage: builder.mutation<Product, { id: number; file: File }>({
      query: (body) => {
        const formData = new FormData();
        formData.append("file", body.file);
        return {
          url: `products/${body.id}/image`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [productTags(id)],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByParamsQuery,
  useGetProductTranslationsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUploadImageMutation,
} = productsApiSlice;

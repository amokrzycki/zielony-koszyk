import type { Locale } from "@/i18n/locale.ts";

export interface ProductText {
  name: string;
  description: string;
}

/** Every localized field of a product, keyed by locale. Admin-only; the public API returns one language. */
export type ProductTranslations = Record<Locale, ProductText>;

/** Fields shared by all languages. */
export interface ProductBase {
  price: number;
  category: string;
  stock_quantity: number;
}

export interface CreateProductBody extends ProductBase {
  translations: ProductTranslations;
}

export type UpdateProductBody = Partial<ProductBase> & { translations?: Partial<ProductTranslations> };

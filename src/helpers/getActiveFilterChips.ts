import { CATEGORIES, DEFAULT_PRICE_MAX, DEFAULT_PRICE_MIN } from "@/constants/app.ts";
import type { ProductParams } from "@/types/ProductParams.ts";

export interface ActiveFilterChip {
  key: "search" | "category" | "price";
  label: string;
  clear: Partial<Record<keyof ProductParams, string>>;
}

/** Single source of truth for the active-filter chips and the mobile filter count. */
export const getActiveFilterChips = (filters: ProductParams): ActiveFilterChip[] => {
  const chips: ActiveFilterChip[] = [];

  if (filters.search) {
    chips.push({ key: "search", label: `Szukaj: „${filters.search}”`, clear: { search: "", page: "1" } });
  }

  const category = CATEGORIES.find((item) => item.value === filters.category);
  if (category) {
    chips.push({ key: "category", label: `Kategoria: ${category.label}`, clear: { category: "", page: "1" } });
  }

  const priceMin = filters.priceMin ?? DEFAULT_PRICE_MIN;
  const priceMax = filters.priceMax ?? DEFAULT_PRICE_MAX;

  if (priceMin !== DEFAULT_PRICE_MIN || priceMax !== DEFAULT_PRICE_MAX) {
    chips.push({
      key: "price",
      label: `Cena: ${priceMin}–${priceMax} PLN`,
      clear: {
        priceMin: DEFAULT_PRICE_MIN.toString(),
        priceMax: DEFAULT_PRICE_MAX.toString(),
        page: "1",
      },
    });
  }

  return chips;
};

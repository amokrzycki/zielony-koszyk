import type { TFunction } from "i18next";
import { CATEGORIES, DEFAULT_PRICE_MAX, DEFAULT_PRICE_MIN, WHOLE_PLN } from "@/constants/app.ts";
import { LOCALE_TAGS, type Locale } from "@/i18n/locale.ts";
import type { ProductParams } from "@/types/ProductParams.ts";

export interface ActiveFilterChip {
  key: "search" | "category" | "price";
  label: string;
  clear: Partial<Record<keyof ProductParams, string>>;
}

/** `t` needs the catalog and common namespaces. */
export interface ChipFormat {
  t: TFunction<["catalog", "common"]>;
  locale: Locale;
}

/** "5–20 zł" / "PLN 5–20"; `formatRange` is newer than the ES2020 lib the project compiles against. */
const priceRange = (min: number, max: number, locale: Locale) =>
  (
    new Intl.NumberFormat(LOCALE_TAGS[locale], WHOLE_PLN) as Intl.NumberFormat & {
      formatRange: (start: number, end: number) => string;
    }
  ).formatRange(min, max);

/** Single source of truth for the active-filter chips and the mobile filter count. */
export const getActiveFilterChips = (filters: ProductParams, { t, locale }: ChipFormat): ActiveFilterChip[] => {
  const chips: ActiveFilterChip[] = [];

  if (filters.search) {
    chips.push({
      key: "search",
      label: t("filters.chips.search", { query: filters.search }),
      clear: { search: "", page: "1" },
    });
  }

  const category = CATEGORIES.find((item) => item.value === filters.category);
  if (category) {
    chips.push({
      key: "category",
      label: t("filters.chips.category", { category: t(category.labelKey, { ns: "common" }) }),
      clear: { category: "", page: "1" },
    });
  }

  const priceMin = filters.priceMin ?? DEFAULT_PRICE_MIN;
  const priceMax = filters.priceMax ?? DEFAULT_PRICE_MAX;

  if (priceMin !== DEFAULT_PRICE_MIN || priceMax !== DEFAULT_PRICE_MAX) {
    chips.push({
      key: "price",
      label: t("filters.chips.price", { range: priceRange(priceMin, priceMax, locale) }),
      clear: {
        priceMin: DEFAULT_PRICE_MIN.toString(),
        priceMax: DEFAULT_PRICE_MAX.toString(),
        page: "1",
      },
    });
  }

  return chips;
};

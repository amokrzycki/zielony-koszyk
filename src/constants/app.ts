import { Categories } from "@/enums/Categories.ts";
import { CURRENCY } from "@/i18n/format.ts";

export const FILTER_DIRECTION_ASC = "ASC";
export const FILTER_DIRECTION_DESC = "DESC";

export const DEFAULT_PRICE_MIN = 0;
export const DEFAULT_PRICE_MAX = 500;

/** `labelKey` resolves in the common namespace; `value` is the stable id sent to the API. */
export const CATEGORIES = [
  { value: Categories.COLLECTIVE, labelKey: "categories.worki" },
  { value: Categories.FRUITS, labelKey: "categories.owoce" },
  { value: Categories.VEGETABLES, labelKey: "categories.warzywa" },
  { value: Categories.SEASONAL, labelKey: "categories.sezonowe" },
  { value: Categories.OTHERS, labelKey: "categories.inne" },
] as const;

/** `labelKey` resolves in the catalog namespace. */
export const SORT_MODES = [
  { value: "priceAsc", labelKey: "sort.priceAsc", orderBy: "price", orderDir: "ASC" },
  { value: "priceDesc", labelKey: "sort.priceDesc", orderBy: "price", orderDir: "DESC" },
  { value: "nameAsc", labelKey: "sort.nameAsc", orderBy: "name", orderDir: "ASC" },
  { value: "nameDesc", labelKey: "sort.nameDesc", orderBy: "name", orderDir: "DESC" },
] as const;

/** Whole-zloty amounts for the price slider and chips: no `,00`. */
export const WHOLE_PLN: Intl.NumberFormatOptions = { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 };

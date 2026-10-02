import { Categories } from "@/enums/Categories.ts";

export const FILTER_DIRECTION_ASC = "ASC";
export const FILTER_DIRECTION_DESC = "DESC";

export const DEFAULT_PRICE_MIN = 0;
export const DEFAULT_PRICE_MAX = 500;

export const CATEGORIES = [
  { value: Categories.COLLECTIVE, label: "Zbiorcze" },
  { value: Categories.FRUITS, label: "Owoce" },
  { value: Categories.VEGETABLES, label: "Warzywa" },
  { value: Categories.SEASONAL, label: "Sezonowe" },
  { value: Categories.OTHERS, label: "Spożywcze" },
];

export const SORT_MODES = [
  {
    value: "priceAsc",
    label: "wg ceny rosnąco",
    orderBy: "price",
    orderDir: "ASC",
  },
  {
    value: "priceDesc",
    label: "wg ceny malejąco",
    orderBy: "price",
    orderDir: "DESC",
  },
  {
    value: "nameAsc",
    label: "wg nazwy A-Z",
    orderBy: "name",
    orderDir: "ASC",
  },
  {
    value: "nameDesc",
    label: "wg nazwy Z-A",
    orderBy: "name",
    orderDir: "DESC",
  },
];

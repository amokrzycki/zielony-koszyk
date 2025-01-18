export const FILTER_DIRECTION_ASC = "ASC";
export const FILTER_DIRECTION_DESC = "DESC";

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

import useSortFilter from "./useSortFilter.ts";
import type { SortDirection } from "./useSortFilter";
import { convertToNumber } from "../helpers/convertToNumber.ts";
import { useSearchParams } from "react-router-dom";
import type { ProductParams } from "../types/ProductParams.ts";
import { DEFAULT_PRICE_MAX, DEFAULT_PRICE_MIN, FILTER_DIRECTION_ASC } from "../constants/app.ts";
import { convertToSearchParams } from "../helpers/convertToSearchParams.ts";

const useProductFilters = (): {
  setParams: (updates: Partial<Record<keyof ProductParams, string>>) => void;
  resetFilters: () => void;
  filters: ProductParams;
  changeSortBy: (newSortBy: string) => void;
} => {
  const initialProductParams = {
    search: "",
    category: "",
    priceMin: DEFAULT_PRICE_MIN.toString(),
    priceMax: DEFAULT_PRICE_MAX.toString(),
    page: "1",
    pageSize: "24",
    orderBy: "name",
    orderDir: FILTER_DIRECTION_ASC as SortDirection,
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [direction, sortBy, changeSortBy] = useSortFilter(
    initialProductParams.orderDir,
    "orderDir",
    initialProductParams.orderBy,
    "orderBy",
  );

  const search = searchParams.get("search") || initialProductParams.search;
  const category = searchParams.get("category") || initialProductParams.category;
  const priceMin = convertToNumber(searchParams.get("priceMin"), DEFAULT_PRICE_MIN);
  const priceMax = convertToNumber(searchParams.get("priceMax"), DEFAULT_PRICE_MAX);
  const page = convertToNumber(searchParams.get("page"), 1);
  const pageSize = convertToNumber(searchParams.get("pageSize"), 24);

  const initialParams = convertToSearchParams(initialProductParams);

  const setParams = (updates: Partial<Record<keyof ProductParams, string>>) => {
    setSearchParams(
      (prev) => {
        for (const [key, value] of Object.entries(updates)) {
          prev.set(key, value);
        }
        return prev;
      },
      { replace: true },
    );
  };

  const resetFilters = () => {
    setSearchParams(initialParams, { replace: true });
  };

  return {
    filters: {
      search,
      category,
      priceMin,
      priceMax,
      page,
      pageSize,
      orderBy: sortBy,
      orderDir: direction,
    },
    setParams,
    resetFilters,
    changeSortBy,
  };
};

export default useProductFilters;

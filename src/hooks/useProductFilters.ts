import useSortFilter from "./useSortFilter.ts";
import type { SortDirection } from "./useSortFilter";
import { convertToNumber } from "../helpers/convertToNumber.ts";
import { useSearchParams } from "react-router-dom";
import { ProductParams } from "../types/ProductParams.ts";
import { FILTER_DIRECTION_ASC } from "../constants/app.ts";
import { convertToSearchParams } from "../helpers/convertToSearchParams.ts";

const useProductFilters = (): {
  setParam: (name: keyof ProductParams, value: string) => void;
  resetFilters: () => void;
  filters: ProductParams;
  changeSortBy: (newSortBy: string) => void;
} => {
  const initialProductParams = {
    search: "",
    category: "",
    priceMin: "0",
    priceMax: "500",
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
  const category =
    searchParams.get("category") || initialProductParams.category;
  const priceMin = convertToNumber(searchParams.get("priceMin"), 0);
  const priceMax = convertToNumber(searchParams.get("priceMax"), 500);
  const page = convertToNumber(searchParams.get("page"), 1);
  const pageSize = convertToNumber(searchParams.get("pageSize"), 24);

  const initialParams = convertToSearchParams(initialProductParams);

  const setParam = (name: keyof ProductParams, value: string) => {
    setSearchParams(
      (prev) => {
        prev.set(name, value);
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
    setParam,
    resetFilters,
    changeSortBy,
  };
};

export default useProductFilters;

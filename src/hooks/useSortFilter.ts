import {
  FILTER_DIRECTION_ASC,
  FILTER_DIRECTION_DESC,
} from "../constants/app.ts";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export type SortDirection = "ASC" | "DESC";

const useSortFilter = (
  sortDirectionInitialValue: SortDirection = FILTER_DIRECTION_DESC,
  sortDirectionParamName = "direction",
  sortByInitialValue = "createdAt",
  sortByParamName = "sortBy",
): [SortDirection, string, (newSortBy: string) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();
  const direction =
    (searchParams.get(sortDirectionParamName) as SortDirection) ??
    sortDirectionInitialValue;
  const sortBy = searchParams.get(sortByParamName) ?? sortByInitialValue;

  // set initial Value
  useEffect(() => {
    if (!searchParams || searchParams.size === 0) {
      setSearchParams(
        (prev) => {
          prev.set(sortDirectionParamName, sortDirectionInitialValue);
          prev.set(sortByParamName, sortByInitialValue);
          return prev;
        },
        { replace: true },
      );
    }
  }, []);

  const changeSortBy = (newSortBy: string) => {
    const newSortDir =
      sortBy === newSortBy
        ? direction === FILTER_DIRECTION_DESC
          ? FILTER_DIRECTION_ASC
          : FILTER_DIRECTION_DESC
        : FILTER_DIRECTION_ASC;
    setSearchParams(
      (prev) => {
        prev.set(sortDirectionParamName, newSortDir);
        prev.set(sortByParamName, newSortBy);
        return prev;
      },
      { replace: true },
    );
  };

  return [direction, sortBy, changeSortBy];
};

export default useSortFilter;

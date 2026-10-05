import { Pagination } from "@mui/material";
import useProductFilters from "@/hooks/useProductFilters.ts";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

interface FiltersPageProps {
  totalCount: number | undefined;
}

function FiltersPagination({ totalCount }: FiltersPageProps) {
  const { t } = useTranslation("catalog");
  const { filters, setParams } = useProductFilters();

  const handleChange = (_event: ChangeEvent<unknown>, value: number) => {
    setParams({ page: value.toString() });
  };

  return (
    <Pagination
      count={totalCount}
      color="primary"
      page={filters.page}
      onChange={handleChange}
      hidden={!totalCount}
      getItemAriaLabel={(type, page, selected) => {
        switch (type) {
          case "first":
            return t("pagination.first");
          case "last":
            return t("pagination.last");
          case "next":
            return t("pagination.next");
          case "previous":
            return t("pagination.previous");
          default:
            return t(selected ? "pagination.currentPage" : "pagination.page", { page });
        }
      }}
      sx={{ "& .MuiPaginationItem-root": { borderRadius: "10px", fontWeight: 700 } }}
    />
  );
}

export default FiltersPagination;

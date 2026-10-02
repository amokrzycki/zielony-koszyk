import { Pagination } from "@mui/material";
import useProductFilters from "@/hooks/useProductFilters.ts";
import type { ChangeEvent } from "react";

interface FiltersPageProps {
  totalCount: number | undefined;
}

function FiltersPagination({ totalCount }: FiltersPageProps) {
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
      sx={{ "& .MuiPaginationItem-root": { borderRadius: "10px", fontWeight: 700 } }}
    />
  );
}

export default FiltersPagination;

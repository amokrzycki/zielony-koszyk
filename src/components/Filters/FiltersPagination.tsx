import { Pagination } from "@mui/material";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { ChangeEvent } from "react";

interface FiltersPageProps {
  totalCount: number | undefined;
}

function FiltersPagination({ totalCount }: FiltersPageProps) {
  const { filters, setParam } = useProductFilters();

  const handleChange = (_event: ChangeEvent<unknown>, value: number) => {
    setParam("page", value.toString());
  };

  return (
    <Pagination
      count={totalCount}
      color="primary"
      page={filters.page}
      onChange={handleChange}
      hidden={!totalCount}
    />
  );
}

export default FiltersPagination;

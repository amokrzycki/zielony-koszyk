import { Box } from "@mui/material";
import Search from "./Search.tsx";
import SortSelector from "@/components/Filters/SortSelector.tsx";
import PageSizeSelector from "@/components/Filters/PageSizeSelector.tsx";
import { ReactNode } from "react";

interface FiltersBarProps {
  pagination: ReactNode;
}

function FiltersBar({ pagination }: FiltersBarProps) {
  return (
    <Box
      id="search-wrapper"
      className={"flex justify-between items-center gap-2 p-8 rounded-2xl"}
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <SortSelector />
      <PageSizeSelector />
      <Search />
      {pagination}
    </Box>
  );
}

export default FiltersBar;

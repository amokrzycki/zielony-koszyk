import { Box } from "@mui/material";
import Search from "./Search.tsx";
import SortSelector from "@/components/Filters/SortSelector.tsx";
import PageSizeSelector from "@/components/Filters/PageSizeSelector.tsx";
import type { ReactNode } from "react";
import { panelSx } from "@/components/listingStyles.ts";

interface FiltersBarProps {
  pagination: ReactNode;
}

function FiltersBar({ pagination }: FiltersBarProps) {
  return (
    <Box id="search-wrapper" className={"flex flex-wrap items-center gap-3 p-3 sm:p-4"} sx={panelSx}>
      <SortSelector />
      <PageSizeSelector />
      <Search />
      <Box sx={{ ml: { sm: "auto" } }}>{pagination}</Box>
    </Box>
  );
}

export default FiltersBar;

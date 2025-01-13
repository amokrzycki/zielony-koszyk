import { Box, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, useEffect, useState } from "react";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { useDebouncedValue } from "@mantine/hooks";

function Search() {
  const { filters, setParam } = useProductFilters();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    setParam("search", debouncedSearchTerm || "");
    setParam("page", "1");
  }, [debouncedSearchTerm]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  return (
    <Box sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <TextField
        sx={{ ml: 1, flex: 1 }}
        variant={"standard"}
        placeholder="Wyszukaj produkty"
        value={searchTerm}
        onChange={handleInputChange}
      />
    </Box>
  );
}

export default Search;

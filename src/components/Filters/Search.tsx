import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { type ChangeEvent, useEffect, useState } from "react";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { useDebouncedValue } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { EASE, tone } from "@/components/listingStyles.ts";

function Search() {
  const { t } = useTranslation("catalog");
  const { filters, setParams } = useProductFilters();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect is used to update the search param when the debounced search term changes
  useEffect(() => {
    setParams({ search: debouncedSearchTerm || "", page: "1" });
  }, [debouncedSearchTerm]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        gap: 1,
        minWidth: { xs: "100%", sm: 200 },
        px: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        bgcolor: "background.paper",
        transition: `border-color 200ms ${EASE}, box-shadow 200ms ${EASE}`,
        "&:focus-within": { borderColor: "primary.main", boxShadow: (t) => `0 0 0 3px ${tone(t, 0.16)}` },
      }}>
      <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
      <TextField
        variant="standard"
        placeholder={t("filters.searchPlaceholder")}
        value={searchTerm}
        onChange={handleInputChange}
        slotProps={{ htmlInput: { "aria-label": t("filters.searchPlaceholder") } }}
        sx={{
          flex: 1,
          "& .MuiInputBase-root::before, & .MuiInputBase-root::after": { borderBottom: "none" },
          "& .MuiInputBase-input": { py: 1 },
        }}
      />
    </Box>
  );
}

export default Search;

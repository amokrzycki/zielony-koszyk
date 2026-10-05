import useProductFilters from "@/hooks/useProductFilters.ts";
import { useTranslation } from "react-i18next";
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

function PageSizeSelector() {
  const { t } = useTranslation("catalog");
  const { filters, setParams } = useProductFilters();

  const handlePageSizeChange = (e: SelectChangeEvent) => {
    setParams({ pageSize: e.target.value as string, page: "1" });
  };

  return (
    <FormControl
      size="small"
      variant="outlined"
      sx={{
        minWidth: 126,
        borderRadius: "12px",
        bgcolor: "background.paper",
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "text.secondary" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
      }}>
      <InputLabel id="page-size-select-label">{t("filters.pageSize")}</InputLabel>
      <Select
        labelId="page-size-select-label"
        id="page-size-select"
        label={t("filters.pageSize")}
        value={filters.pageSize?.toString() || "24"}
        onChange={handlePageSizeChange}>
        <MenuItem value="24">24</MenuItem>
        <MenuItem value="48">48</MenuItem>
        <MenuItem value="96">96</MenuItem>
      </Select>
    </FormControl>
  );
}

export default PageSizeSelector;

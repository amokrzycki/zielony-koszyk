import { SORT_MODES } from "@/constants/app";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { useTranslation } from "react-i18next";
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

const controlSx = {
  borderRadius: "12px",
  bgcolor: "background.paper",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "text.secondary" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
};

function SortSelector() {
  const { t } = useTranslation("catalog");
  const { filters, setParams } = useProductFilters();
  const sortValue =
    SORT_MODES.find((mode) => mode.orderBy === filters.orderBy && mode.orderDir === filters.orderDir)?.value ??
    "nameAsc";

  const handleSortChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;

    const selectedMode = SORT_MODES.find((m) => m.value === newValue);
    if (!selectedMode) return;

    setParams({ orderBy: selectedMode.orderBy || "", orderDir: selectedMode.orderDir || "", page: "1" });
  };

  return (
    <FormControl size="small" variant="outlined" sx={controlSx}>
      <InputLabel id="sort-select-label">{t("filters.sortLabel")}</InputLabel>
      <Select
        labelId="sort-select-label"
        id="sort-select"
        label={t("filters.sortLabel")}
        value={sortValue}
        onChange={handleSortChange}>
        {SORT_MODES.map((mode) => (
          <MenuItem key={mode.value} value={mode.value}>
            {t(mode.labelKey)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SortSelector;

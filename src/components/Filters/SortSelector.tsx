import { SORT_MODES } from "@/constants/app";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

function SortSelector() {
  const { filters, setParam } = useProductFilters();
  const sortValue =
    SORT_MODES.find((mode) => mode.orderBy === filters.orderBy && mode.orderDir === filters.orderDir)?.value ??
    "nameAsc";

  const handleSortChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;

    const selectedMode = SORT_MODES.find((m) => m.value === newValue);
    if (!selectedMode) return;

    setParam("orderBy", selectedMode.orderBy || "");
    setParam("orderDir", selectedMode.orderDir || "");
    setParam("page", "1");
  };

  return (
    <FormControl size="small" variant="outlined">
      <InputLabel id="sort-select-label">Sortowanie</InputLabel>
      <Select
        labelId="sort-select-label"
        id="sort-select"
        label="Sortowanie"
        value={sortValue}
        onChange={handleSortChange}>
        {SORT_MODES.map((mode) => (
          <MenuItem key={mode.value} value={mode.value}>
            {mode.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SortSelector;

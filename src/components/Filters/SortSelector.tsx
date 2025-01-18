import { SORT_MODES } from "@/constants/app";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

function SortSelector() {
  const { filters, setParam } = useProductFilters();

  const findCurrentSortValue = () => {
    const { orderBy, orderDir } = filters;

    if (!orderBy && !orderDir) {
      return "nameAsc";
    }

    const mode = SORT_MODES.find(
      (m) => m.orderBy === orderBy && m.orderDir === orderDir,
    );
    return mode ? mode.value : "nameAsc";
  };

  const [sortValue, setSortValue] = useState<string>("nameAsc");

  useEffect(() => {
    setSortValue(findCurrentSortValue());
  }, [filters.orderBy, filters.orderDir]);

  const handleSortChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value as string;
    setSortValue(newValue);

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
        onChange={handleSortChange}
      >
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

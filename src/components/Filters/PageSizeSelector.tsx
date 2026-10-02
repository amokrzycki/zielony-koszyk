import useProductFilters from "@/hooks/useProductFilters.ts";
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

const controlSx = {
  minWidth: 170,
  borderRadius: "12px",
  bgcolor: "background.paper",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "text.secondary" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
};

function PageSizeSelector() {
  const { filters, setParams } = useProductFilters();

  const handlePageSizeChange = (e: SelectChangeEvent) => {
    setParams({ pageSize: e.target.value as string, page: "1" });
  };

  return (
    <FormControl size="small" variant="outlined" sx={controlSx}>
      <InputLabel id="page-size-select-label">Ilość produktów na stronę</InputLabel>
      <Select
        labelId="page-size-select-label"
        id="page-size-select"
        label="Ilość produktów na stronę"
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

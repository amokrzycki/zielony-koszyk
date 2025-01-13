import useProductFilters from "@/hooks/useProductFilters.ts";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

function PageSizeSelector() {
  const { filters, setParam } = useProductFilters();

  const handlePageSizeChange = (e: SelectChangeEvent) => {
    setParam("pageSize", e.target.value as string);
    setParam("page", "1");
  };

  return (
    <FormControl
      size="small"
      variant="outlined"
      sx={{
        minWidth: 170,
      }}
    >
      <InputLabel id="page-size-select-label">
        Ilość produktów na stronę
      </InputLabel>
      <Select
        labelId="page-size-select-label"
        id="page-size-select"
        label="Ilość produktów na stronę"
        value={filters.pageSize?.toString() || "24"}
        onChange={handlePageSizeChange}
      >
        <MenuItem value="24">24</MenuItem>
        <MenuItem value="48">48</MenuItem>
        <MenuItem value="96">96</MenuItem>
      </Select>
    </FormControl>
  );
}

export default PageSizeSelector;

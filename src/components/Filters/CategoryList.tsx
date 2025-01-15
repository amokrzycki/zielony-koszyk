import { Categories } from "@/enums/Categories.ts";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { Box, Button } from "@mui/material";
import { MouseEventHandler } from "react";

const CATEGORIES = [
  { value: Categories.COLLECTIVE, label: "Zbiorcze" },
  { value: Categories.FRUITS, label: "Owoce" },
  { value: Categories.VEGETABLES, label: "Warzywa" },
  { value: Categories.SEASONAL, label: "Sezonowe" },
  { value: Categories.OTHERS, label: "Spożywcze" },
];

function CategoryList() {
  const { filters, setParam } = useProductFilters();

  const handleCategoryChange: MouseEventHandler<HTMLButtonElement> = (e) => {
    setParam("category", e.currentTarget.value);
    setParam("page", "1");
  };

  return (
    <Box className={"flex flex-col gap-4"}>
      {CATEGORIES.map((cat) => (
        <Button
          key={cat.value}
          variant={filters.category === cat.value ? "contained" : "text"}
          onClick={handleCategoryChange}
          value={cat.value}
        >
          {cat.label}
        </Button>
      ))}
      {filters.category && (
        <Button
          variant="contained"
          sx={{ mb: 4 }}
          onClick={() => {
            setParam("category", "");
            setParam("page", "1");
          }}
        >
          Wyczyść
        </Button>
      )}
    </Box>
  );
}

export default CategoryList;

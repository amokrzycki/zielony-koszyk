import { Categories } from "@/enums/Categories.ts";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { Box, Button } from "@mui/material";
import type { MouseEventHandler } from "react";
import { accentText, tone } from "@/components/listingStyles.ts";

const CATEGORIES = [
  { value: Categories.COLLECTIVE, label: "Zbiorcze" },
  { value: Categories.FRUITS, label: "Owoce" },
  { value: Categories.VEGETABLES, label: "Warzywa" },
  { value: Categories.SEASONAL, label: "Sezonowe" },
  { value: Categories.OTHERS, label: "Spożywcze" },
];

function CategoryList() {
  const { filters, setParams } = useProductFilters();

  const handleCategoryChange: MouseEventHandler<HTMLButtonElement> = (e) => {
    setParams({ category: e.currentTarget.value, page: "1" });
  };

  return (
    <Box className={"flex flex-col gap-1.5"}>
      {CATEGORIES.map((cat) => {
        const active = filters.category === cat.value;
        return (
          <Button
            key={cat.value}
            value={cat.value}
            aria-pressed={active}
            onClick={handleCategoryChange}
            disableRipple
            sx={{
              justifyContent: "flex-start",
              px: 2,
              py: 0.9,
              border: "1px solid",
              borderColor: active ? "primary.main" : "transparent",
              borderRadius: "999px",
              color: active ? (t) => accentText(t) : "text.secondary",
              bgcolor: active ? (t) => tone(t, 0.12) : "transparent",
              fontSize: "0.95rem",
              fontWeight: 700,
              textTransform: "none",
              transition: "background-color 200ms, color 200ms, border-color 200ms",
              "&:hover": { bgcolor: (t) => tone(t, 0.1), color: (t) => accentText(t), borderColor: "divider" },
              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
            }}>
            {cat.label}
          </Button>
        );
      })}
      {filters.category && (
        <Button
          onClick={() => {
            setParams({ category: "", page: "1" });
          }}
          variant="text"
          sx={{
            mt: 1,
            borderRadius: "999px",
            color: "text.secondary",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { color: (t) => accentText(t), bgcolor: (t) => tone(t, 0.08) },
          }}>
          Wyczyść
        </Button>
      )}
    </Box>
  );
}

export default CategoryList;

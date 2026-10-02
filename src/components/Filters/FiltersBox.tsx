import type React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Stack, Slider, Button } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import useProductFilters from "@/hooks/useProductFilters";
import CategoryList from "@/components/Filters/CategoryList.tsx";
import { accentText, panelSx } from "@/components/listingStyles.ts";

// Micro-label shared with the footer column headings, darkened for legibility on the light panel.
const groupLabelSx = {
  mb: 1.5,
  color: (t: Theme) => accentText(t),
  fontSize: "0.8rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

function FiltersBox() {
  const { filters, setParams } = useProductFilters();

  const { priceMin, priceMax } = filters;

  const [priceRange, setPriceRange] = useState<[number, number]>([priceMin ?? 0, priceMax ?? 500]);

  const isPriceRangeSet = priceRange[0] !== 0 || priceRange[1] !== 500;

  useEffect(() => {
    setPriceRange([typeof priceMin === "number" ? priceMin : 0, typeof priceMax === "number" ? priceMax : 500]);
  }, [priceMin, priceMax]);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue as [number, number]);
    }
  };

  const handlePriceChangeCommitted = (_event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const [minVal, maxVal] = newValue as [number, number];
      setParams({ priceMin: minVal.toString(), priceMax: maxVal.toString(), page: "1" });
    }
  };

  return (
    <Box
      component="aside"
      aria-label="Filtry produktów"
      className={"flex w-full shrink-0 flex-col p-5 sm:p-6 lg:w-72 xl:w-80"}
      sx={(theme) => ({ ...panelSx(theme), position: { lg: "sticky" }, top: { lg: "88px" } })}>
      <Typography component="h2" sx={groupLabelSx}>
        Kategoria
      </Typography>
      <CategoryList />

      <Box sx={{ height: "1px", my: 3, bgcolor: "divider" }} />

      <Typography component="h2" sx={groupLabelSx}>
        Zakres cenowy
      </Typography>
      <Stack spacing={1.5} direction="column">
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{priceRange[0]} PLN</Typography>
          <Typography sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{priceRange[1]} PLN</Typography>
        </Stack>
        <Box className={"pl-2 pr-2"}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            onChangeCommitted={handlePriceChangeCommitted}
            valueLabelDisplay="auto"
            min={0}
            max={500}
          />
        </Box>
        {isPriceRangeSet && (
          <Button
            onClick={() => {
              setPriceRange([0, 500]);
              setParams({ priceMin: "0", priceMax: "500", page: "1" });
            }}
            variant={"text"}
            sx={{
              alignSelf: "flex-start",
              borderRadius: "999px",
              color: "text.secondary",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { color: (t) => accentText(t) },
            }}>
            Resetuj
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default FiltersBox;

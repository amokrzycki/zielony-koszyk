import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Slider, Button } from "@mui/material";
import useProductFilters from "@/hooks/useProductFilters";
import CategoryList from "@/components/Filters/CategoryList.tsx";

function FiltersBox() {
  const { filters, setParam } = useProductFilters();

  const { priceMin, priceMax } = filters;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    priceMin ?? 0,
    priceMax ?? 500,
  ]);

  const isPriceRangeSet = priceRange[0] !== 0 || priceRange[1] !== 500;

  useEffect(() => {
    setPriceRange([
      typeof priceMin === "number" ? priceMin : 0,
      typeof priceMax === "number" ? priceMax : 500,
    ]);
  }, [priceMin, priceMax]);

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue as [number, number]);
    }
  };

  const handlePriceChangeCommitted = (
    _event: React.SyntheticEvent | Event,
    newValue: number | number[],
  ) => {
    if (Array.isArray(newValue)) {
      const [minVal, maxVal] = newValue as [number, number];
      setParam("priceMin", minVal.toString());
      setParam("priceMax", maxVal.toString());
      setParam("page", "1");
    }
  };

  return (
    <Box
      className={"flex-col p-8 h-1/3 rounded-2xl w-1/4"}
      sx={{ bgcolor: "background.paper" }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Kategoria
      </Typography>
      <CategoryList />
      <Typography variant="h5" component="h2" gutterBottom>
        Zakres cenowy
      </Typography>
      <Stack spacing={2} direction="column" sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography>{priceRange[0]} PLN</Typography>
          <Typography>{priceRange[1]} PLN</Typography>
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
              setParam("priceMin", "0");
              setParam("priceMax", "500");
              setParam("page", "1");
            }}
            variant={"text"}
          >
            Resetuj
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default FiltersBox;

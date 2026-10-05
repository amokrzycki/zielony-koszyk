import type React from "react";
import { useState, useEffect } from "react";
import { Box, Typography, Stack, Slider, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { Theme } from "@mui/material/styles";
import useProductFilters from "@/hooks/useProductFilters";
import CategoryList from "@/components/Filters/CategoryList.tsx";
import { accentText, panelSx } from "@/components/listingStyles.ts";
import { DEFAULT_PRICE_MAX, DEFAULT_PRICE_MIN, WHOLE_PLN } from "@/constants/app.ts";
import { useFormat } from "@/i18n/useLocale.ts";

const groupLabelSx = {
  mb: 1.5,
  color: (t: Theme) => accentText(t),
  fontSize: "0.8rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
};

export function FiltersContent() {
  const { t } = useTranslation("catalog");
  const { number } = useFormat();
  const money = (value: number) => number(value, WHOLE_PLN);
  const { filters, setParams } = useProductFilters();

  const { priceMin, priceMax } = filters;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    priceMin ?? DEFAULT_PRICE_MIN,
    priceMax ?? DEFAULT_PRICE_MAX,
  ]);

  const isPriceRangeSet = priceRange[0] !== DEFAULT_PRICE_MIN || priceRange[1] !== DEFAULT_PRICE_MAX;

  useEffect(() => {
    setPriceRange([
      typeof priceMin === "number" ? priceMin : DEFAULT_PRICE_MIN,
      typeof priceMax === "number" ? priceMax : DEFAULT_PRICE_MAX,
    ]);
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
    <>
      <Typography component="h2" sx={groupLabelSx}>
        {t("filters.category")}
      </Typography>
      <CategoryList />

      <Box sx={{ height: "1px", my: 3, bgcolor: "divider" }} />

      <Typography component="h2" sx={groupLabelSx}>
        {t("filters.priceRange")}
      </Typography>
      <Stack spacing={1.5} direction="column">
        <Stack direction="row" justifyContent="space-between">
          <Typography sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{money(priceRange[0])}</Typography>
          <Typography sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{money(priceRange[1])}</Typography>
        </Stack>
        <Box style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            onChangeCommitted={handlePriceChangeCommitted}
            valueLabelDisplay="auto"
            valueLabelFormat={money}
            getAriaLabel={(index) => t(index === 0 ? "filters.priceMin" : "filters.priceMax")}
            min={DEFAULT_PRICE_MIN}
            max={DEFAULT_PRICE_MAX}
          />
        </Box>
        {isPriceRangeSet && (
          <Button
            onClick={() => {
              setPriceRange([DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX]);
              setParams({
                priceMin: DEFAULT_PRICE_MIN.toString(),
                priceMax: DEFAULT_PRICE_MAX.toString(),
                page: "1",
              });
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
            {t("filters.resetPrice")}
          </Button>
        )}
      </Stack>
    </>
  );
}

function FiltersBox() {
  const { t } = useTranslation("catalog");

  return (
    <Box
      component="aside"
      aria-label={t("filters.label")}
      className={"hidden w-full shrink-0 flex-col p-5 sm:p-6 lg:flex lg:w-72 xl:w-80"}
      sx={(theme) => ({ ...panelSx(theme), position: { lg: "sticky" }, top: { lg: "88px" } })}>
      <FiltersContent />
    </Box>
  );
}

export default FiltersBox;

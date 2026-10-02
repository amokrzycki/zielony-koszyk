import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import ProductCard from "./ProductCard.tsx";
import type Product from "@/types/Product.ts";
import LoadingOverlay from "../common/LoadingOverlay.tsx";
import SwapLayers from "../common/SwapLayers.tsx";
import FiltersBar from "../Filters/FiltersBar.tsx";
import FiltersBox from "../Filters/FiltersBox.tsx";
import FiltersDrawer from "../Filters/FiltersDrawer.tsx";
import ActiveFilters from "../Filters/ActiveFilters.tsx";
import PageSizeSelector from "../Filters/PageSizeSelector.tsx";
import { useGetProductsByParamsQuery } from "./productsApiSlice.ts";
import useProductFilters from "@/hooks/useProductFilters.ts";
import { getActiveFilterChips } from "@/helpers/getActiveFilterChips.ts";
import FiltersPagination from "@/components/Filters/FiltersPagination.tsx";
import GoToTop from "@/components/Products/GoToTop.tsx";
import { DUR, EASE, accentText, panelSx, tone } from "@/components/listingStyles.ts";

function Products() {
  const { filters, setParams } = useProductFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const fetchedProducts = useGetProductsByParamsQuery(filters);
  const { data, error, isLoading, isFetching } = fetchedProducts;
  const products = data?.data || [];
  const searchQuery = filters.search;
  const totalCount = data?.totalCount;
  const shownCount = data ? Math.min((data.currentPage - 1) * data.pageSize + products.length, data.totalCount) : 0;
  const activeFilterCount = getActiveFilterChips(filters).length;

  if (error) {
    return (
      <Box
        id="main-wrapper"
        sx={{ display: "flex", minHeight: "60vh", alignItems: "center", justifyContent: "center", px: 3 }}>
        <Typography variant="h5" component="h2" sx={{ textAlign: "center" }}>
          Wystąpił błąd podczas pobierania produktów.
        </Typography>
      </Box>
    );
  }

  return (
    <Box id="main-wrapper">
      <Box
        component="section"
        sx={{ width: "100%", maxWidth: 1560, mx: "auto", px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 4, lg: 6 } }}>
        <Box sx={{ mb: { xs: 3, lg: 4 } }}>
          <Typography
            component="h1"
            sx={{
              m: 0,
              fontSize: { xs: "2rem", sm: "2.4rem", lg: "2.9rem" },
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              textWrap: "balance",
            }}>
            Produkty
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary", lineHeight: 1.5, maxWidth: "60ch" }}>
            Świeże warzywa, owoce i produkty spożywcze od lokalnych dostawców.
          </Typography>
        </Box>

        <Box className="flex flex-col items-start gap-4 lg:flex-row lg:gap-6">
          <FiltersBox />
          <Box className="flex min-w-0 w-full flex-col gap-4">
            <FiltersBar onOpenFilters={() => setFiltersOpen(true)} activeFilterCount={activeFilterCount} />
            <ActiveFilters />
            {/* One constant panel: the spinner floats over it and the list fades in, so nothing blinks or swaps out.
                Later pages dim the current list instead (isFetching). */}
            <Box
              aria-busy={isFetching}
              sx={(t) => ({
                ...panelSx(t),
                opacity: isFetching && !isLoading ? 0.55 : 1,
                transition: `opacity ${DUR.base}ms ${EASE}`,
              })}>
              <SwapLayers id={isLoading ? "loading" : "ready"} tween={false}>
                {isLoading ? (
                  <LoadingOverlay />
                ) : (
                  <Box className="flex flex-col gap-3 p-4 sm:p-5">
                    {products.length === 0 ? (
                      <EmptyResults searchQuery={searchQuery} onClear={() => setParams({ search: "", page: "1" })} />
                    ) : (
                      products.map((product: Product) => <ProductCard key={product.product_id} product={product} />)
                    )}
                  </Box>
                )}
              </SwapLayers>
            </Box>
            {!isLoading && products.length > 0 && (
              <Box className="fade-in flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <Typography
                  className="order-2 sm:order-1"
                  sx={{ color: "text.secondary", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  Wyświetlono {shownCount} z {totalCount}
                </Typography>
                <Box className="order-1 sm:order-2">
                  <FiltersPagination totalCount={data?.totalPages} />
                </Box>
                <Box className="order-3">
                  <PageSizeSelector />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <FiltersDrawer open={filtersOpen} onClose={() => setFiltersOpen(false)} />
      <GoToTop />
    </Box>
  );
}

function EmptyResults({ searchQuery, onClear }: { searchQuery?: string; onClear: () => void }) {
  return (
    <Box className="flex flex-col items-center gap-3 py-14 text-center">
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          color: "primary.main",
          bgcolor: (t) => tone(t, 0.12),
          "& svg": { fontSize: 28 },
        }}>
        <SearchOffRoundedIcon />
      </Box>
      <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
        Brak produktów
      </Typography>
      <Typography sx={{ maxWidth: "46ch", color: "text.secondary", lineHeight: 1.55 }}>
        {searchQuery
          ? `Nie znaleźliśmy nic dla frazy „${searchQuery}”.`
          : "Żaden produkt nie spełnia wybranych filtrów."}
      </Typography>
      {searchQuery && (
        <Button
          onClick={onClear}
          variant="outlined"
          sx={{
            mt: 1,
            borderRadius: "999px",
            borderColor: "divider",
            color: "text.primary",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { borderColor: "primary.main", color: (t) => accentText(t) },
          }}>
          Wyczyść wyszukiwanie
        </Button>
      )}
    </Box>
  );
}

export default Products;

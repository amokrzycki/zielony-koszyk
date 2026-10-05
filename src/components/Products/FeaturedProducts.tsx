import ProductCard from "@/components/Products/ProductCard.tsx";
import { useGetProductsQuery } from "@/components/Products/productsApiSlice.ts";
import { Box, Typography } from "@mui/material";
import LoadingOverlay from "@/components/common/LoadingOverlay.tsx";
import SwapLayers from "@/components/common/SwapLayers.tsx";
import ErrorView from "@/components/common/ErrorView.tsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/i18n/useLocale.ts";
import type Product from "@/types/Product.ts";

function FeaturedProducts() {
  const { t } = useTranslation("catalog");
  const locale = useLocale();
  const { data: products, isError, isLoading } = useGetProductsQuery({ locale });

  const featuredProducts = useMemo(() => {
    if (!products) return [];
    const copy = [...products];
    const tempFeatured: Product[] = [];
    const count = Math.min(4, copy.length);
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * copy.length);
      tempFeatured.push(copy[randomIndex]);
      copy.splice(randomIndex, 1);
    }
    return tempFeatured;
  }, [products]);

  if (isLoading) {
    return (
      <SwapLayers id="loading" tween={false}>
        <LoadingOverlay />
      </SwapLayers>
    );
  }

  if (isError || !products) {
    return (
      <SwapLayers id="error" tween={false}>
        <ErrorView message={t("featured.error")} />
      </SwapLayers>
    );
  }

  return (
    <SwapLayers id="ready" tween={false}>
      <Box component="section" sx={{ mt: { xs: 6, lg: 8 } }}>
        <Typography
          component="h2"
          sx={{
            m: 0,
            mb: { xs: 2.5, lg: 3 },
            fontSize: { xs: "1.5rem", sm: "1.75rem", lg: "2rem" },
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}>
          {t("featured.title")}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2.5, lg: 3 } }}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </Box>
      </Box>
    </SwapLayers>
  );
}

export default FeaturedProducts;

import ProductCard from "@/components/Products/ProductCard.tsx";
import { useGetProductsQuery } from "@/components/Products/productsApiSlice.ts";
import { Box, Typography } from "@mui/material";
import Loading from "@/components/common/Loading.tsx";
import ErrorView from "@/components/common/ErrorView.tsx";
import { useMemo } from "react";
import type Product from "@/types/Product.ts";

function FeaturedProducts() {
  const { data: products, isError, isLoading } = useGetProductsQuery();

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
    return <Loading />;
  }

  if (isError || !products) {
    return <ErrorView message={"Wystąpił błąd podczas pobierania polecanych produktów"} />;
  }

  return (
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
        Polecane produkty
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2.5, lg: 3 } }}>
        {featuredProducts.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </Box>
    </Box>
  );
}

export default FeaturedProducts;

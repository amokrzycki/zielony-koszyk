import ProductCard from "@/components/Products/ProductCard.tsx";
import { useGetProductsQuery } from "@/components/Products/productsApiSlice.ts";
import { Box, Typography } from "@mui/material";
import Loading from "@/components/common/Loading.tsx";
import ErrorView from "@/components/common/ErrorView.tsx";
import { useMemo } from "react";
import Product from "@/types/Product.ts";

function FeaturedProducts() {
  const { data: products, isError, isLoading } = useGetProductsQuery();

  const featuredProducts = useMemo(() => {
    if (!products) return [];
    const copy = [...products];
    const tempFeatured: Product[] = [];
    for (let i = 0; i < 4; i++) {
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
    return (
      <ErrorView
        message={"Wystąpił błąd podczas pobierania polecanych produktów"}
      />
    );
  }

  return (
    <Box className={"ml-4 max-xl:mt-8"}>
      <Typography variant="h4" component="h2">
        Polecane produkty
      </Typography>
      <Box className={"flex flex-col"}>
        {featuredProducts.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </Box>
    </Box>
  );
}

export default FeaturedProducts;

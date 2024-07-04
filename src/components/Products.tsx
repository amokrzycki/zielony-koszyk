import { useEffect, useState } from "react";
import { getProducts } from "../api.ts";
import Product from "../types/Product.ts";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProductCard from "./ProductCard.tsx";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setProducts(products);
      } catch (e) {
        setError(
          "Wystąpił błąd podczas pobierania produktów. Spróbuj ponownie później.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts()
      .then(() => {
        console.log("Products fetched");
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  if (loading) {
    return (
      <Box
        id="main-wrapper"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 72px - 156px - 30px)",
        }}
      >
        <CircularProgress sx={{ color: "#FFF" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        id="main-wrapper"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 72px - 156px - 30px)",
        }}
      >
        <Typography variant="h5" component="h2">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
        padding: 2,
      }}
      id="main-wrapper"
    >
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </Box>
  );
}

export default Products;

import { Params, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Product from "../types/Product.ts";
import { getProducts } from "../api.ts";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProductCard from "./ProductCard.tsx";

function Category() {
  const { categoryId }: Readonly<Params> = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let products = await getProducts();
        products = products.filter(
          (product: Product) => product.category === categoryId,
        );
        setProducts(products);
      } catch (e) {
        setError(
          "Wystąpił błąd podczas pobierania produktów. Spróbuj ponownie później.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts().then(() => {
      console.log("Products fetched");
    });
  }, [categoryId]);

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

export default Category;

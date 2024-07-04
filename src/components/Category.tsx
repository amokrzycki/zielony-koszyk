import { Params, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Product from "../types/Product.ts";
import { getProducts } from "../api.ts";
import { Box, CircularProgress, Typography } from "@mui/material";
import ProductCard from "./ProductCard.tsx";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter.ts";
import Search from "./Search.tsx";

function Category() {
  const { categoryId }: Readonly<Params> = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        if (searchQuery) {
          const lowerCaseSearchQuery = searchQuery.toLowerCase();
          setProducts(
            products.filter(
              (product: Product) =>
                product.category === categoryId &&
                (product.name.toLowerCase().includes(lowerCaseSearchQuery) ||
                  product.description
                    .toLowerCase()
                    .includes(lowerCaseSearchQuery)),
            ),
          );
        } else {
          setProducts(
            products.filter(
              (product: Product) => product.category === categoryId,
            ),
          );
        }
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
  }, [searchQuery, categoryId]);

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
    <Box id="main-wrapper">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          {capitalizeFirstLetter(categoryId)}
        </Typography>
        <Search />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          padding: 2,
        }}
      >
        {searchQuery && products.length === 0 ? (
          <Typography variant="h5" component="h2">
            Nie znaleziono produktów pasujących do zapytania w tej kategorii dla
            frazy: "{searchQuery}".
          </Typography>
        ) : (
          products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        )}
      </Box>
    </Box>
  );
}

export default Category;

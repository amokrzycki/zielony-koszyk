import { Box, Typography } from "@mui/material";
import ProductCard from "./ProductCard.tsx";
import Search from "./Search.tsx";
import { useSearchParams } from "react-router-dom";
import Product from "../../types/Product.ts";
import { useGetProductsLikeNameQuery } from "./productsApiSlice.ts";
import Loading from "../common/Loading.tsx";

function Products() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const fetchedProducts = useGetProductsLikeNameQuery(searchQuery || "");
  const { data, error } = fetchedProducts;

  if (fetchedProducts.isLoading) {
    return (
      <Box className={"h-screen"}>
        <Loading />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        id="main-wrapper"
        className={"flex justify-center items-center h-full"}
      >
        <Typography variant="h5" component="h2">
          Wystąpił błąd podczas pobierania produktów.
        </Typography>
      </Box>
    );
  }

  return (
    <Box id="main-wrapper">
      <Box id="search-wrapper" className={"flex justify-center w-full"}>
        <Search />
      </Box>
      <Box className={"flex justify-center flex-wrap gap-2 p-2"}>
        {searchQuery && data?.length === 0 && (
          <Typography variant="h5" component="h2">
            Brak produktów spełniających kryteria wyszukiwania dla frazy: "
            {searchQuery}".
          </Typography>
        )}
        {data.length > 0 &&
          data?.map((product: Product, index: number) => (
            <ProductCard key={index} product={product} />
          ))}
      </Box>
    </Box>
  );
}

export default Products;

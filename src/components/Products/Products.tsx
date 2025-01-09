import { Box, Typography } from "@mui/material";
import ProductCard from "./ProductCard.tsx";
import { useSearchParams } from "react-router-dom";
import Product from "../../types/Product.ts";
import { useGetProductsLikeNameQuery } from "./productsApiSlice.ts";
import Loading from "../common/Loading.tsx";
import FiltersBar from "../FiltersBar.tsx";
import FiltersBox from "../FiltersBox.tsx";

function Products() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const fetchedProducts = useGetProductsLikeNameQuery(searchQuery || "");
  const { data, error, isLoading, isFetching } = fetchedProducts;

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
      <Box className={"main-container flex"}>
        <FiltersBox />
        <Box className={"flex flex-col ml-4 w-full"}>
          <FiltersBar />
          {isLoading || isFetching ? (
            <Box
              className={"p-8 rounded-2xl mt-4 h-[50vh]"}
              sx={{ bgcolor: "background.paper" }}
            >
              <Loading />
            </Box>
          ) : (
            <Box
              className={
                "flex flex-col justify-center flex-wrap gap-2 p-8 mt-4 rounded-2xl"
              }
              sx={{ bgcolor: "background.paper" }}
            >
              {searchQuery && data?.length === 0 && (
                <Typography variant="h5" component="h2">
                  Brak produktów spełniających kryteria wyszukiwania dla frazy:
                  "{searchQuery}".
                </Typography>
              )}
              {data.length > 0 &&
                data?.map((product: Product, index: number) => (
                  <ProductCard key={index} product={product} />
                ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Products;

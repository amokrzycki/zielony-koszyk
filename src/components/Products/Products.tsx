import { Box, Typography } from "@mui/material";
import ProductCard from "./ProductCard.tsx";
import Product from "@/types/Product.ts";
import Loading from "../common/Loading.tsx";
import FiltersBar from "../Filters/FiltersBar.tsx";
import FiltersBox from "../Filters/FiltersBox.tsx";
import { useGetProductsByParamsQuery } from "./productsApiSlice.ts";
import useProductFilters from "@/hooks/useProductFilters.ts";
import FiltersPagination from "@/components/Filters/FiltersPagination.tsx";
import GoToTop from "@/components/Products/GoToTop.tsx";

function Products() {
  const { filters } = useProductFilters();
  const fetchedProducts = useGetProductsByParamsQuery(filters);
  const { data, error, isLoading, isFetching } = fetchedProducts;
  const products = data?.data || [];
  const searchQuery = filters.search;

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
          <FiltersBar
            pagination={<FiltersPagination totalCount={data?.totalPages} />}
          />
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
              {searchQuery && products.length === 0 && (
                <Typography variant="h5" component="h2">
                  Brak produktów spełniających kryteria wyszukiwania dla frazy:
                  "{searchQuery}".
                </Typography>
              )}
              {products.length > 0 &&
                products.map((product: Product, index: number) => (
                  <ProductCard key={index} product={product} />
                ))}
              <Box className={"flex w-full justify-center mt-4"}>
                <FiltersPagination totalCount={data?.totalPages} />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <GoToTop />
    </Box>
  );
}

export default Products;

import { Params, useParams, useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ProductCard from "./ProductCard.tsx";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter.ts";
import Search from "./Search.tsx";
import { useGetProductsByCategoryQuery } from "./productsApiSlice.ts";
import Product from "../../types/Product.ts";
import Loading from "../common/Loading.tsx";

function Category() {
  const { categoryId }: Readonly<Params> = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const fetchedProducts = useGetProductsByCategoryQuery({
    category: categoryId as string,
    name: searchQuery || "",
  });
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
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 72px - 156px - 30px)",
        }}
      >
        <Typography variant="h5" component="h2">
          Wystąpił błąd podczas pobierania produktów.
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
          {capitalizeFirstLetter(categoryId || "")}
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
        {searchQuery && data?.length === 0 ? (
          <Typography variant="h5" component="h2">
            Nie znaleziono produktów pasujących do zapytania w tej kategorii dla
            frazy: "{searchQuery}".
          </Typography>
        ) : (
          data?.map((product: Product, index: number) => (
            <ProductCard key={index} product={product} />
          ))
        )}
      </Box>
    </Box>
  );
}

export default Category;

import { Box } from "@mui/material";
import Categories from "./Categories.tsx";
import ImageCarousel from "@/components/ImageCarousel.tsx";

function Homepage() {
  return (
    <Box id="main-wrapper" className={"flex flex-col items-center h-full pt-6"}>
      <ImageCarousel />
      <Categories />
    </Box>
  );
}

export default Homepage;

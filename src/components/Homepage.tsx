import { Box } from "@mui/material";
import Categories from "./Categories.tsx";

function Homepage() {
  return (
    <Box
      id="main-wrapper"
      className={"flex flex-col items-center h-screen pt-6"}
    >
      <Categories />
    </Box>
  );
}

export default Homepage;

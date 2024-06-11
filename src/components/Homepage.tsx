import { Box } from "@mui/material";
import Categories from "./Categories.tsx";

function Homepage() {
  return (
    <Box
      id="main-wrapper"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Witaj w Zielonym Koszyczku</h1>
      <p>Sklep internetowy z ekologicznymi produktami spożywczymi</p>
      <Categories />
    </Box>
  );
}

export default Homepage;

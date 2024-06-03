import { Box } from "@mui/material";

function Homepage() {
  return (
    <Box
      id={"homepage-wrapper"}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Witaj w Zielonym Koszyczku</h1>
      <p>Sklep internetowy z ekologicznymi produktami spożywczymi</p>
    </Box>
  );
}

export default Homepage;

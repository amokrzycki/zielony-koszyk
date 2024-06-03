import { Box } from "@mui/material";

function Nav() {
  return (
    <Box
      id="navigation-wrapper"
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        "& img": {
          width: 20,
          height: 20,
          objectFit: "cover",
        },
        "& a": {
          textDecoration: "none",
          color: "black",
        },
      }}
    >
      <a href="/">Strona Główna</a>
      <a href="/produkty">Produkty</a>
      <a href="/o-nas">O nas</a>
      <a href="/kontakt">Kontakt</a>
    </Box>
  );
}

export default Nav;

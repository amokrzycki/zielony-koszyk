import { Box } from "@mui/material";
import Nav from "./Nav.tsx";

function Header() {
  return (
    <Box
      component="header"
      id="app-header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        padding: 2,
        bgcolor: "background.paper",
        color: "text.primary",
        "& img": {
          width: 50,
          height: 50,
          objectFit: "cover",
        },
        "& div": {
          cursor: "pointer",
        },
      }}
    >
      <img src="logo192.png" alt="logo" />
      <Nav />
      <Box
        id="user-actions-wrapper"
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          "& img": {
            width: 20,
            height: 20,
            objectFit: "cover",
          },
          "& div": {
            cursor: "pointer",
          },
        }}
      >
        <Box>Koszyk</Box>
        <Box>Logowanie</Box>
      </Box>
    </Box>
  );
}

export default Header;

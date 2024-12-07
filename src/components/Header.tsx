import { AppBar, Box } from "@mui/material";
import Nav from "./Nav.tsx";
import CartBadge from "./Cart/CartBadge.tsx";
import ModeSwitcher from "./ModeSwitcher.tsx";
import UserBadge from "./Accounts/UserBadge.tsx";

function Header() {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "primary.main",
        color: "text.primary",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem",
        flexDirection: "row",
        gap: 2,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <img src="/logo.png" alt="logo" height="60px" />
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
        <ModeSwitcher />
        <Box>
          <CartBadge />
        </Box>
        <UserBadge />
      </Box>
    </AppBar>
  );
}

export default Header;

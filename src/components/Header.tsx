import { AppBar, Box } from "@mui/material";
import Nav from "./Nav.tsx";
import CartBadge from "./Cart/CartBadge.tsx";
import ModeSwitcher from "./ModeSwitcher.tsx";
import UserBadge from "./Accounts/UserBadge.tsx";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

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
      <img
        src="/logo.png"
        alt="logo"
        className={"h-16 cursor-pointer z-10"}
        onClick={() => {
          navigate("/");
        }}
      />
      <Nav />
      <Box id="user-actions-wrapper" className={"flex items-center gap-2"}>
        <ModeSwitcher />
        <CartBadge />
        <UserBadge />
      </Box>
    </AppBar>
  );
}

export default Header;

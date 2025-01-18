import { AppBar, Box } from "@mui/material";
import Nav from "./Nav.tsx";
import CartBadge from "./Cart/CartBadge.tsx";
import ModeSwitcher from "./ModeSwitcher.tsx";
import UserBadge from "./Accounts/UserBadge.tsx";
import { useNavigate } from "react-router-dom";
import { useMode } from "../providers/ModeProvider.tsx";

function Header() {
  const navigate = useNavigate();
  const { mode } = useMode();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "background.paper",
        position: "fixed",
        alignItems: "center",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Box
        className={
          "justify-between flex items-center gap-2 p-2 w-full 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg"
        }
      >
        <img
          src={`/${mode}_logo.png`}
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
      </Box>
    </AppBar>
  );
}

export default Header;

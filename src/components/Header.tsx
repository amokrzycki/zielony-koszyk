import { AppBar, Box, IconButton, Stack, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Nav from "./Nav.tsx";
import CartBadge from "./Cart/CartBadge.tsx";
import ModeSwitcher from "./ModeSwitcher.tsx";
import UserBadge from "./Accounts/UserBadge.tsx";
import MobileMenu from "./MobileMenu.tsx";
import { useNavigate } from "react-router-dom";
import { useMode } from "../providers/ModeProvider.tsx";
import { HEADER_SHADOW, NAV_HEIGHT, navPillSx } from "./navStyles.ts";

function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode } = useMode();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          backgroundImage: "none",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: HEADER_SHADOW,
        }}>
        <Box
          sx={{
            mx: "auto",
            width: "100%",
            maxWidth: 1560,
            px: { xs: 2, sm: 3, lg: 4 },
            height: NAV_HEIGHT,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start", minWidth: 0 }}>
            <Box
              component="img"
              src={`/${mode}_logo.png`}
              alt="Zielony koszyk — strona główna"
              role="button"
              tabIndex={0}
              onClick={() => navigate("/")}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/");
                }
              }}
              sx={{ height: { xs: 34, md: 44 }, width: "auto", cursor: "pointer", flexShrink: 0 }}
            />
          </Box>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Nav />
          </Box>

          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 1 }}
            sx={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
            <ModeSwitcher />
            <CartBadge />
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <UserBadge />
            </Box>
            <IconButton
              onClick={() => setMenuOpen(true)}
              aria-label="Otwórz menu"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              sx={{ ...navPillSx(theme), display: { md: "none" } }}>
              <MenuIcon />
            </IconButton>
          </Stack>
        </Box>
      </AppBar>
      <MobileMenu open={menuOpen} mode={mode} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default Header;

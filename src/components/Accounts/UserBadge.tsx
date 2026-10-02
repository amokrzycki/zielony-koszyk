import PersonIcon from "@mui/icons-material/Person";
import { Box, Button, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import type { RootState } from "@/store/store.ts";
import type { AccountState } from "@/reducers/accountReducers.ts";
import type React from "react";
import { useState } from "react";
import { logoutUser } from "./accountSlice.ts";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Roles } from "@/enums/Roles.ts";
import { useLogoutMutation } from "./accountsApiSlice.ts";
import { navPillSx, navRowSx } from "../navStyles.ts";

interface UserBadgeProps {
  variant?: "bar" | "drawer";
  onNavigate?: () => void;
}

function UserBadge({ variant = "bar", onNavigate }: UserBadgeProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const auth = useAppSelector((state: RootState): AccountState => state.auth);
  const [endSession] = useLogoutMutation();

  const isAccountActive = pathname === "/login" || pathname.startsWith("/konto");

  const accountRoutes = [
    { label: "Profil", route: "/konto" },
    { label: "Zamówienia", route: "/konto/zamowienia" },
    ...(auth.user.role === Roles.ADMIN ? [{ label: "Panel administracyjny", route: "/admin" }] : []),
  ];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (auth.token) {
      setAnchorEl(e.currentTarget);
    } else {
      navigate("/login");
    }
  };

  const go = (route: string) => {
    setAnchorEl(null);
    onNavigate?.();
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      await endSession().unwrap();
      setAnchorEl(null);
      onNavigate?.();
      dispatch(logoutUser());
      toast.success("Zostałeś wylogowany");
      navigate("/");
    } catch {
      toast.error("Nie udało się wylogować");
    }
  };

  if (variant === "drawer") {
    return (
      <Box component="nav" aria-label="Konto" sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {auth.token ? (
          <>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>Witaj, {auth.user.first_name}!</Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis" }}>
                {auth.user.email}
              </Typography>
            </Box>
            {accountRoutes.map(({ label, route }) => (
              <Button
                key={route}
                onClick={() => go(route)}
                className={pathname === route ? "active" : undefined}
                sx={navRowSx(theme)}>
                {label}
              </Button>
            ))}
            <Button onClick={handleLogout} sx={navRowSx(theme)}>
              Wyloguj się
            </Button>
          </>
        ) : (
          <Button onClick={() => go("/login")} className={isAccountActive ? "active" : undefined} sx={navRowSx(theme)}>
            Moje konto
          </Button>
        )}
      </Box>
    );
  }

  return (
    <>
      <Button
        id="user-button"
        startIcon={<PersonIcon fontSize="small" />}
        aria-controls={auth.token ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        aria-label={auth.token ? `Menu konta: ${auth.user.first_name}` : "Moje konto"}
        onClick={handleClick}
        className={isAccountActive ? "active" : undefined}
        sx={navPillSx(theme)}>
        <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
          {auth.token ? `Witaj ${auth.user.first_name}!` : "Moje konto"}
        </Box>
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ "aria-labelledby": "user-button" }}>
        {accountRoutes.map(({ label, route }) => (
          <MenuItem key={route} onClick={() => go(route)}>
            {label}
          </MenuItem>
        ))}
        <MenuItem onClick={handleLogout}>Wyloguj się</MenuItem>
      </Menu>
    </>
  );
}

export default UserBadge;

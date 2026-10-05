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
import { useTranslation } from "react-i18next";
import { matchRoute } from "@/i18n/routes.ts";
import { useLocalePath } from "@/i18n/useLocale.ts";
import { Roles } from "@/enums/Roles.ts";
import { useLogoutMutation } from "./accountsApiSlice.ts";
import { navPillSx, navRowSx } from "../navStyles.ts";

interface UserBadgeProps {
  variant?: "bar" | "drawer";
  onNavigate?: () => void;
}

function UserBadge({ variant = "bar", onNavigate }: UserBadgeProps) {
  const theme = useTheme();
  const { t } = useTranslation("account");
  const to = useLocalePath();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const auth = useAppSelector((state: RootState): AccountState => state.auth);
  const [endSession] = useLogoutMutation();

  const routeId = matchRoute(pathname)?.id;
  const isAccountActive = routeId === "login" || Boolean(routeId?.startsWith("account"));

  const accountRoutes = [
    { label: t("badge.profile"), route: to("account") },
    { label: t("badge.orders"), route: to("accountOrders") },
    ...(auth.user.role === Roles.ADMIN ? [{ label: t("badge.admin"), route: to("admin") }] : []),
  ];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (auth.token) {
      setAnchorEl(e.currentTarget);
    } else {
      navigate(to("login"));
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
      toast.success(t("badge.loggedOut"));
      navigate(to("home"));
    } catch {
      toast.error(t("badge.logoutFailed"));
    }
  };

  if (variant === "drawer") {
    return (
      <Box component="nav" aria-label={t("badge.account")} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {auth.token ? (
          <>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                {t("view.welcome", { name: auth.user.first_name })}
              </Typography>
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
              {t("badge.logout")}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => go(to("login"))}
            className={isAccountActive ? "active" : undefined}
            sx={navRowSx(theme)}>
            {t("badge.myAccount")}
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
        aria-label={auth.token ? t("badge.menuAria", { name: auth.user.first_name }) : t("badge.myAccount")}
        onClick={handleClick}
        className={isAccountActive ? "active" : undefined}
        sx={navPillSx(theme)}>
        <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
          {auth.token ? t("badge.greeting", { name: auth.user.first_name }) : t("badge.myAccount")}
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
        <MenuItem onClick={handleLogout}>{t("badge.logout")}</MenuItem>
      </Menu>
    </>
  );
}

export default UserBadge;

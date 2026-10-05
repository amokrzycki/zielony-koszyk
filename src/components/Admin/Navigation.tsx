import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SellIcon from "@mui/icons-material/Sell";
import GroupIcon from "@mui/icons-material/Group";
import type { Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { accentText, EASE } from "@/components/listingStyles.ts";
import { useLocalePath } from "@/i18n/useLocale.ts";

interface AdminNavItem {
  id: "products" | "orders" | "users";
  route: "adminProducts" | "adminOrders" | "adminUsers";
  icon: typeof Inventory2Icon;
}

/** Labels live in the `admin` namespace under `nav.items.<id>`; `route` also drives the active-state prefix match. */
export const adminNavItems: AdminNavItem[] = [
  { id: "products", route: "adminProducts", icon: Inventory2Icon },
  { id: "orders", route: "adminOrders", icon: SellIcon },
  { id: "users", route: "adminUsers", icon: GroupIcon },
];

/** Nav rows sit on the forest-ink rail, so their states are tuned for a dark ground. */
const railRowSx = (theme: Theme) => ({
  justifyContent: "flex-start",
  gap: 1.5,
  width: "100%",
  px: 1.5,
  py: 1.1,
  borderRadius: "14px",
  textAlign: "left",
  color: "rgba(255,255,255,0.72)",
  fontSize: "0.95rem",
  fontWeight: 700,
  letterSpacing: "0.005em",
  transition: `color 200ms ${EASE}, background-color 200ms ${EASE}`,
  "&:hover": { color: "#ffffff", backgroundColor: "rgba(255,255,255,0.08)" },
  "&:focus-visible": { outline: `2px solid ${accentText(theme)}`, outlineOffset: 2 },
  "&.active": { color: accentText(theme), backgroundColor: "rgba(0,206,124,0.16)" },
  "&.active:hover": { backgroundColor: "rgba(0,206,124,0.22)" },
});

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation("admin");
  const to = useLocalePath();

  const go = (path: string) => {
    onNavigate?.();
    navigate(path);
  };

  return (
    <Box component="nav" aria-label={t("nav.label")} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const path = to(item.route);
        const active = pathname.startsWith(path);
        return (
          <Button
            key={item.id}
            disableRipple
            onClick={() => go(path)}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
            sx={railRowSx}>
            <Icon sx={{ fontSize: 20, flexShrink: 0 }} />
            <Box component="span" sx={{ display: "flex", flexDirection: "column", lineHeight: 1.25, minWidth: 0 }}>
              <Box component="span">{t(`nav.items.${item.id}.label`)}</Box>
              <Box
                component="span"
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  opacity: 0.62,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                {t(`nav.items.${item.id}.hint`)}
              </Box>
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}

export default Navigation;

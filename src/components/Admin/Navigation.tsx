import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SellIcon from "@mui/icons-material/Sell";
import GroupIcon from "@mui/icons-material/Group";
import type { Theme } from "@mui/material/styles";
import { accentText, EASE } from "@/components/listingStyles.ts";

interface AdminNavItem {
  label: string;
  hint: string;
  route: string;
  icon: typeof Inventory2Icon;
  match: string;
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Produkty",
    hint: "Katalog i stany",
    route: "/admin/zarzadzanie-produktami",
    icon: Inventory2Icon,
    match: "/admin/zarzadzanie-produktami",
  },
  {
    label: "Zamówienia",
    hint: "Realizacja i statusy",
    route: "/admin/zarzadzanie-zamowieniami",
    icon: SellIcon,
    match: "/admin/zarzadzanie-zamowieniami",
  },
  {
    label: "Użytkownicy",
    hint: "Konta i adresy",
    route: "/admin/zarzadzanie-uzytkownikami",
    icon: GroupIcon,
    match: "/admin/zarzadzanie-uzytkownikami",
  },
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

  const go = (route: string) => {
    onNavigate?.();
    navigate(route);
  };

  return (
    <Box component="nav" aria-label="Nawigacja panelu" sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(item.match);
        return (
          <Button
            key={item.route}
            disableRipple
            onClick={() => go(item.route)}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
            sx={railRowSx}>
            <Icon sx={{ fontSize: 20, flexShrink: 0 }} />
            <Box component="span" sx={{ display: "flex", flexDirection: "column", lineHeight: 1.25, minWidth: 0 }}>
              <Box component="span">{item.label}</Box>
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
                {item.hint}
              </Box>
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}

export default Navigation;

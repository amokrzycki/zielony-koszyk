import { Box, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";
import { navPillSx, navRowSx } from "./navStyles.ts";

interface NavProps {
  vertical?: boolean;
  /** Called after a link is followed, e.g. to close the drawer. */
  onNavigate?: () => void;
}

function Nav({ vertical = false, onNavigate }: NavProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const to = useLocalePath();
  const links = [
    { to: to("home"), label: t("nav.home"), end: true },
    { to: to("products"), label: t("nav.products") },
    { to: to("about"), label: t("nav.about") },
  ];
  return (
    <Box
      component="nav"
      aria-label={t("nav.label")}
      sx={{
        display: "flex",
        flexDirection: vertical ? "column" : "row",
        alignItems: vertical ? "stretch" : "center",
        gap: 0.5,
      }}>
      {links.map(({ to, label, end }) => (
        <Box
          key={to}
          component={NavLink}
          to={to}
          end={end}
          onClick={onNavigate}
          sx={vertical ? navRowSx(theme) : navPillSx(theme)}>
          {label}
        </Box>
      ))}
    </Box>
  );
}

export default Nav;

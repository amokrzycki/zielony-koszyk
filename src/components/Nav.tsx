import { Box, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";
import { navPillSx, navRowSx } from "./navStyles.ts";

const links = [
  { to: "/", label: "Strona główna", end: true },
  { to: "/produkty", label: "Produkty" },
  { to: "/o-nas", label: "O nas" },
];

interface NavProps {
  vertical?: boolean;
  /** Called after a link is followed, e.g. to close the drawer. */
  onNavigate?: () => void;
}

function Nav({ vertical = false, onNavigate }: NavProps) {
  const theme = useTheme();
  return (
    <Box
      component="nav"
      aria-label="Nawigacja główna"
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

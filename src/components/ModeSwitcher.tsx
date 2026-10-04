import { Box, IconButton, useTheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useMode } from "../providers/ModeProvider.tsx";
import { navPillSx } from "./navStyles.ts";
import { DUR, EASE } from "./listingStyles.ts";

// Both icons stay mounted in one grid cell; the inactive one turns away and fades so the swap reads as a rotation.
const iconSx = (active: boolean) => ({
  gridArea: "1 / 1",
  opacity: active ? 1 : 0,
  transform: active ? "rotate(0)" : "rotate(-90deg) scale(0.6)",
  transition: `opacity ${DUR.base}ms ${EASE}, transform ${DUR.slow}ms ${EASE}`,
});

function ModeSwitcher() {
  const theme = useTheme();
  const { mode, toggleMode } = useMode();

  return (
    <IconButton
      onClick={toggleMode}
      aria-label={mode === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
      sx={{ ...navPillSx(theme), px: 1.25, py: 1.25 }}>
      <Box component="span" aria-hidden sx={{ display: "grid", placeItems: "center" }}>
        <LightModeIcon fontSize="small" sx={iconSx(mode === "light")} />
        <DarkModeIcon fontSize="small" sx={iconSx(mode !== "light")} />
      </Box>
    </IconButton>
  );
}

export default ModeSwitcher;

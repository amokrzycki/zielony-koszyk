import { IconButton, useTheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useMode } from "../providers/ModeProvider.tsx";
import { navPillSx } from "./navStyles.ts";

function ModeSwitcher() {
  const theme = useTheme();
  const { mode, toggleMode } = useMode();

  return (
    <IconButton
      onClick={toggleMode}
      aria-label={mode === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
      sx={{ ...navPillSx(theme), px: 1.25, py: 1.25 }}>
      {mode === "light" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </IconButton>
  );
}

export default ModeSwitcher;

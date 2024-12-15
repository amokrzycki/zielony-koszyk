import { IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useMode } from "../providers/ModeProvider.tsx";

function ModeSwitcher() {
  const { mode, toggleMode } = useMode();

  return (
    <IconButton onClick={toggleMode}>
      {mode === "light" ? (
        <LightModeIcon sx={{ color: "text.primary" }} />
      ) : (
        <DarkModeIcon sx={{ color: "text.primary" }} />
      )}
    </IconButton>
  );
}

export default ModeSwitcher;

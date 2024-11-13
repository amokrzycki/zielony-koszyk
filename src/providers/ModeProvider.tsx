import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "../../theme.ts";

const ModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});
export const useMode = () => useContext(ModeContext);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("preferredMode");
    return savedMode ? savedMode : "light";
  });

  useEffect(() => {
    localStorage.setItem("preferredMode", mode);
  }, [mode]);

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ModeContext.Provider>
  );
};

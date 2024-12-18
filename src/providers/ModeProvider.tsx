import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "../../theme.ts";
import { MantineProvider } from "@mantine/core";

const ModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

/* eslint-disable */
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
    <MantineProvider>
      <ModeContext.Provider value={{ mode, toggleMode }}>
        <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ModeContext.Provider>
    </MantineProvider>
  );
};

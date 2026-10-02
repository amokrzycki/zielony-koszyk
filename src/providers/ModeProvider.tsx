import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "../../theme.ts";
import { MantineProvider } from "@mantine/core";
import { flushSync } from "react-dom";

const ModeContext = createContext({
  mode: "light",
  toggleMode: () => {
    //
  },
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
    // Cross-fade the whole page through the View Transitions API (no-op fallback: instant swap).
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode(newMode);
      return;
    }
    document.startViewTransition(() => flushSync(() => setMode(newMode)));
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

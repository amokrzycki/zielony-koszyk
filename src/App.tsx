import "./App.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "../theme.ts";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState("light"); // ['light', 'dark']

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Box
        className="App"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <RouterProvider router={router} />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;

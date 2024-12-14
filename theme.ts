import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ce7c",
      dark: "#007d4e", // Darker shade of #00ce7c
    },
    background: {
      default: "#121212", // Dark background color
      paper: "#1e1e1e", // Slightly lighter background color
    },
    text: {
      primary: "#ffffff", // Text color
      secondary: "#a0a0a0", // Secondary text color
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00ce7c",
      light: "#007d4e", // Darker shade of #00ce7c
    },
    background: {
      default: "#e1dada",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000", // Text color
      secondary: "#837878", // Secondary text color
    },
  },
});

export { darkTheme, lightTheme };

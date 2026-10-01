import { createTheme } from "@mui/material/styles";
import { plPL } from "@mui/material/locale";
import { plPL as plPLGrid } from "@mui/x-data-grid/locales";

const darkTheme = createTheme(
  {
    palette: {
      mode: "dark",
      primary: {
        main: "#00ce7c",
        dark: "#007d4e",
      },
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
      text: {
        primary: "#ffffff",
        secondary: "#a0a0a0",
      },
    },
    typography: {
      fontFamily: "Lato",
    },
  },
  plPL,
  plPLGrid,
);

const lightTheme = createTheme(
  {
    palette: {
      mode: "light",
      primary: {
        main: "#00ce7c",
        light: "#007d4e",
      },
      background: {
        default: "#e1dada",
        paper: "#ffffff",
      },
      text: {
        primary: "#000000",
        // ponytail: was #837878 (3.1:1 on #e1dada, under WCAG AA for body). Darkened until
        // secondary body copy clears 4.5:1. Drop back toward the old tone only with a lighter surface.
        secondary: "#5d5252",
      },
    },
    typography: {
      fontFamily: "Lato",
    },
  },
  plPL,
  plPLGrid,
);

export { darkTheme, lightTheme };

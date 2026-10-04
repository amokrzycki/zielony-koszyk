import { createTheme } from "@mui/material/styles";
import { plPL } from "@mui/material/locale";
import { plPL as plPLGrid } from "@mui/x-data-grid/locales";

// Pin the shrunk label line-height to 1; Tailwind's 1.5 root would push its descenders onto the fieldset border.
const muiComponentOverrides = {
  MuiInputLabel: {
    styleOverrides: {
      root: { "&.MuiInputLabel-shrink": { lineHeight: 1 } },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: { borderRadius: "12px" },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: "999px",
        textTransform: "none",
        fontWeight: 700,
        letterSpacing: "0.005em",
      },
    },
  },
};

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
    components: muiComponentOverrides,
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
        // ponytail: #837878 failed WCAG AA on #e1dada; #5d5252 clears 4.5:1.
        secondary: "#5d5252",
      },
    },
    typography: {
      fontFamily: "Lato",
    },
    components: muiComponentOverrides,
  },
  plPL,
  plPLGrid,
);

export { darkTheme, lightTheme };

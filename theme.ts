import { createTheme } from "@mui/material/styles";
import { plPL } from "@mui/material/locale";
import { plPL as plPLGrid } from "@mui/x-data-grid/locales";

// MUI centres the resting (unshrunk) label using a transform tuned for its default
// line-height (1.4375em). Pinning the root line-height to 1 makes the label box shorter, so its
// visual centre sits ~4px too high when the field is empty. Only the shrunk label needs a short
// line-height: Tailwind's preflight `html { line-height: 1.5 }` would otherwise make the shrunken
// label taller than the gap the fieldset reserves, landing its descenders ("ę") on the top border.
const muiComponentOverrides = {
  MuiInputLabel: {
    styleOverrides: {
      root: { "&.MuiInputLabel-shrink": { lineHeight: 1 } },
    },
  },
  // Matches the 12px radius used by the redesigned search, sort and page-size fields.
  MuiOutlinedInput: {
    styleOverrides: {
      root: { borderRadius: "12px" },
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
        // ponytail: was #837878 (3.1:1 on #e1dada, under WCAG AA for body). Darkened until
        // secondary body copy clears 4.5:1. Drop back toward the old tone only with a lighter surface.
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

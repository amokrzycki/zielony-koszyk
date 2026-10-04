import type { Theme } from "@mui/material/styles";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export const NAV_HEIGHT = { xs: 64, md: 72 };

export const HEADER_SHADOW = "0 1px 2px rgba(15, 23, 20, 0.05), 0 14px 30px -24px rgba(15, 23, 20, 0.5)";

const tint = (theme: Theme, alpha: number) =>
  theme.palette.mode === "dark" ? `rgba(0, 206, 124, ${alpha + 0.02})` : `rgba(0, 206, 124, ${alpha})`;

/** Pill shared by every interactive element in the bar; `.active` is set by NavLink. */
export const navPillSx = (theme: Theme) => ({
  gap: 1,
  px: 1.75,
  py: 0.75,
  borderRadius: "999px",
  fontSize: "0.9375rem",
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: "0.005em",
  textTransform: "none" as const,
  textDecoration: "none",
  whiteSpace: "nowrap",
  color: theme.palette.text.primary,
  transition: `color 200ms ${EASE}, background-color 200ms ${EASE}`,
  "&:hover": {
    color: theme.palette.primary.main,
    backgroundColor: tint(theme, 0.08),
  },
  "&:focus-visible": {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
    backgroundColor: tint(theme, 0.1),
  },
  "&.active": {
    color: theme.palette.primary.main,
    backgroundColor: tint(theme, 0.12),
  },
});

/** Full-width row used inside the mobile drawer. */
export const navRowSx = (theme: Theme) => ({
  ...navPillSx(theme),
  justifyContent: "flex-start",
  width: "100%",
  px: 2,
  py: 1.25,
  borderRadius: "14px",
  fontSize: "1rem",
  fontWeight: 600,
});

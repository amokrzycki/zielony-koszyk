import type { Theme } from "@mui/material/styles";

/** Motion curve shared across the brand surfaces (header, hero, categories). */
export const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Green wash used for active and hover states. Mirrors navStyles.tint. */
export const tone = (theme: Theme, alpha: number) =>
  theme.palette.mode === "dark" ? `rgba(0, 206, 124, ${alpha + 0.02})` : `rgba(0, 206, 124, ${alpha})`;

/**
 * Green for small text sitting on a light surface. Brand green (#00ce7c) is ~2:1 on white, so
 * light mode drops to the darker brand tone (#007d4e, ~5.2:1) to clear WCAG AA.
 */
export const accentText = (theme: Theme) => (theme.palette.mode === "dark" ? theme.palette.primary.main : "#007d4e");

/** Bordered, rounded surface used by the listing toolbar, sidebar and product rows. */
export const panelSx = (theme: Theme) => ({
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "24px",
  boxShadow: theme.palette.mode === "dark" ? "0 18px 44px rgba(0,0,0,0.55)" : "0 18px 44px rgba(15,40,28,0.12)",
});

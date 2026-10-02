import type { Theme } from "@mui/material/styles";

/** Motion curve shared across the brand surfaces (header, hero, categories). */
export const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Forest-green ink used by the footer, the auth brand panel and labels on the bright primary. */
export const BRAND_INK = "#0b1410";

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

/** Primary brand action: pill, bright green, dark ink label. One shape for cart, auth and empty states. */
export const ctaButtonSx = {
  bgcolor: "primary.main",
  color: BRAND_INK,
  borderRadius: "999px",
  px: 3,
  py: 1.25,
  fontWeight: 700,
  textTransform: "none" as const,
  boxShadow: "none",
  transition: `transform 300ms ${EASE}, box-shadow 300ms ${EASE}`,
  "&:hover": { bgcolor: "primary.main", boxShadow: "none", transform: "translateY(-2px)" },
  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
  "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
};

/** Quiet pill action for the secondary choice beside a CTA. */
export const ghostButtonSx = (theme: Theme) => ({
  borderRadius: "999px",
  px: 2.5,
  py: 1.1,
  fontWeight: 700,
  textTransform: "none" as const,
  color: theme.palette.text.primary,
  border: "1px solid",
  borderColor: "divider",
  transition: `color 200ms ${EASE}, border-color 200ms ${EASE}`,
  "&:hover": {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    backgroundColor: "transparent",
  },
  "&:focus-visible": { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
});

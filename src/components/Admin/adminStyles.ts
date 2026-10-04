import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import type { SxProps } from "@mui/material";
import { EASE, panelSx, tone } from "@/components/listingStyles.ts";
import { OrderStatuses } from "@/enums/OrderStatuses.ts";

/** Compiled once: the DataGrid sx follows the MUI v8 callback-theme convention. */
export const adminGridSx: SxProps<Theme> = (theme) => ({
  border: 0,
  bgcolor: "transparent",
  fontFamily: "inherit",
  "--DataGrid-rowBorderColor": theme.palette.divider,
  "& .MuiDataGrid-columnHeaders": {
    bgcolor: tone(theme, 0.06),
    borderBottom: "1px solid",
    borderColor: "divider",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 800,
    fontSize: "0.78rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    color: "text.secondary",
  },
  "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within":
    {
      outline: "none",
    },
  "& .MuiDataGrid-cell": {
    display: "flex",
    alignItems: "center",
    borderColor: "divider",
    fontSize: "0.92rem",
  },
  "& .MuiDataGrid-row": {
    transition: `background-color 200ms ${EASE}`,
  },
  "& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-hovered": {
    backgroundColor: tone(theme, 0.05),
  },
  "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: tone(theme, 0.09),
    "&:hover": { backgroundColor: tone(theme, 0.12) },
  },
  "& .MuiDataGrid-cell--editable": {
    cursor: "cell",
    "&:hover": { backgroundColor: tone(theme, 0.08) },
  },
  "& .MuiDataGrid-toolbarContainer": {
    p: 2,
    gap: 1,
    borderBottom: "1px solid",
    borderColor: "divider",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "1px solid",
    borderColor: "divider",
  },
  "& .MuiTablePagination-root": { fontSize: "0.85rem" },
  "& .MuiDataGrid-overlay": { bgcolor: "transparent" },
});

/** Tabular, right-aligned money; the storefront's `.amountSx` idea for grid cells. */
export const moneyCellSx = {
  width: "100%",
  textAlign: "right",
  fontWeight: 700,
  fontVariantNumeric: "tabular-nums",
} as const;

export const monoCellSx = {
  fontSize: "0.82rem",
  color: "text.secondary",
  fontVariantNumeric: "tabular-nums",
  letterSpacing: "0.01em",
} as const;

const PILL_BASE = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.75,
  px: 1.25,
  py: 0.4,
  borderRadius: "999px",
  border: "1px solid",
  fontSize: "0.78rem",
  fontWeight: 700,
  lineHeight: 1.25,
  whiteSpace: "nowrap",
} as const;

export function orderStatusChipSx(theme: Theme, status: string): SystemStyleObject<Theme> {
  const toneFor = (color: string, alpha: number) => {
    const rgb = color.replace("#", "");
    const value = parseInt(rgb, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  switch (status) {
    case OrderStatuses.NEW:
    case OrderStatuses.IN_PROGRESS:
    case OrderStatuses.TO_BE_SHIPPED:
    case OrderStatuses.SHIPPING:
      return { ...PILL_BASE, color: "primary.dark", bgcolor: tone(theme, 0.12), borderColor: tone(theme, 0.32) };
    case OrderStatuses.DELIVERED:
    case OrderStatuses.DONE:
      return {
        ...PILL_BASE,
        color: "text.secondary",
        bgcolor: theme.palette.action.hover,
        borderColor: theme.palette.divider,
      };
    default:
      // Waiting on the customer: neutral ink, not a forward signal.
      return {
        ...PILL_BASE,
        color: "text.primary",
        bgcolor: theme.palette.action.hover,
        borderColor: toneFor("#5d5252", 0.35),
      };
  }
}

/** Panel sub-heading: MUI subtitle1 (1rem) at the system's heavy weight. */
export const adminSubheadingSx = {
  m: 0,
  fontSize: "1rem",
  fontWeight: 800,
  letterSpacing: "-0.01em",
} as const;

/** Panel wrapper used by every admin table and form body. Tables scroll on narrow screens. */
export const adminPanelSx = (theme: Theme) => ({ ...panelSx(theme), overflowX: "auto" });

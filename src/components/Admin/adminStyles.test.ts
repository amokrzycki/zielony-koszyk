import { describe, expect, it } from "vitest";
import type { Theme } from "@mui/material/styles";
import { orderStatusChipSx } from "./adminStyles.ts";
import { OrderStatuses } from "@/enums/OrderStatuses.ts";

// Minimal shape the helper reads; the theme is only sampled for tokens, not mounted.
const fakeTheme = {
  palette: {
    mode: "light",
    primary: { main: "#00ce7c", dark: "#007d4e" },
    text: { primary: "#000000", secondary: "#5d5252" },
    divider: "rgba(0,0,0,0.12)",
    action: { hover: "rgba(0,0,0,0.04)" },
  },
} as unknown as Theme;

describe("orderStatusChipSx", () => {
  const buckets = new Map<string, unknown>();

  for (const status of Object.values(OrderStatuses)) {
    const sx = orderStatusChipSx(fakeTheme, status) as Record<string, unknown>;
    if (!sx.borderRadius) throw new Error(`no pill for ${status}`);
    buckets.set(status, sx.color);
  }

  it("covers every status with a pill", () => {
    expect(buckets.size).toBe(Object.values(OrderStatuses).length);
  });

  it("uses exactly three semantic buckets", () => {
    expect(new Set(buckets.values()).size).toBe(3);
  });

  it("groups in-flight statuses and separates done from new", () => {
    expect(buckets.get(OrderStatuses.NEW)).toBe(buckets.get(OrderStatuses.SHIPPING));
    expect(buckets.get(OrderStatuses.NEW)).not.toBe(buckets.get(OrderStatuses.DONE));
  });
});

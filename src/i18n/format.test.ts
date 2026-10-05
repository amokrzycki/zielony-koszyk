import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatDateTime, formatNumber } from "./format.ts";

// Intl separates number and unit with (narrow) no-break spaces; compare with plain ones.
const plain = (text: string) => text.replace(/[\s  ]/g, " ");

describe("formatCurrency", () => {
  it("shows PLN in both languages, formatted per locale", () => {
    expect(plain(formatCurrency(1234.5, "pl"))).toBe("1234,50 zł");
    expect(plain(formatCurrency(1234.5, "en"))).toBe("PLN 1,234.50");
  });

  it("accepts the numeric strings the API returns for decimals", () => {
    expect(plain(formatCurrency("6.50", "pl"))).toBe("6,50 zł");
    expect(plain(formatCurrency("6.50", "en"))).toBe("PLN 6.50");
  });
});

describe("formatNumber", () => {
  it("uses the locale's separators", () => {
    expect(plain(formatNumber(1234567.891, "pl", { maximumFractionDigits: 1 }))).toBe("1 234 567,9");
    expect(formatNumber(1234567.891, "en", { maximumFractionDigits: 1 })).toBe("1,234,567.9");
  });
});

describe("dates", () => {
  const instant = "2026-03-05T22:30:00Z"; // already 5 Mar, 23:30 in Warsaw (UTC+1)

  it("formats per locale, in shop time", () => {
    expect(formatDate(instant, "pl")).toBe("5 mar 2026");
    expect(formatDate(instant, "en")).toBe("5 Mar 2026");
    expect(plain(formatDateTime(instant, "pl"))).toContain("23:30");
    expect(plain(formatDateTime(instant, "en"))).toContain("23:30");
  });

  it("does not depend on the machine's time zone near midnight", () => {
    expect(formatDate("2026-06-30T22:30:00Z", "en")).toBe("1 Jul 2026");
  });
});

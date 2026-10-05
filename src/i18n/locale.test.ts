import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, pickLocale, toLocale } from "./locale.ts";

describe("toLocale", () => {
  it.each([
    ["en", "en"],
    ["en-US", "en"],
    ["EN_gb", "en"],
    ["pl-PL", "pl"],
    [" pl ", "pl"],
  ])("%s -> %s (language-only matching)", (input, expected) => {
    expect(toLocale(input)).toBe(expected);
  });

  it.each(["de", "de-DE", "", "xx-en", null, undefined])("%s is unsupported", (input) => {
    expect(toLocale(input)).toBeNull();
  });
});

describe("pickLocale", () => {
  it("takes the first supported entry, in priority order", () => {
    expect(pickLocale(["de-DE", "en-US", "pl"])).toBe("en");
    expect(pickLocale(["pl-PL", "en"])).toBe("pl");
  });

  it("falls back to Polish when nothing is supported or nothing was detected", () => {
    expect(pickLocale(["de", "fr-CA"])).toBe(DEFAULT_LOCALE);
    expect(pickLocale([])).toBe("pl");
    expect(pickLocale(undefined)).toBe("pl");
    expect(pickLocale("ja")).toBe("pl");
  });
});

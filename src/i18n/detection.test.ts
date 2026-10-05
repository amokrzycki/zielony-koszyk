// @vitest-environment happy-dom

import i18next, { type i18n as I18n } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import i18n, { activateLocale, getPreferredLocale, i18nOptions, rememberLocale } from "./index.ts";
import { LOCALE_STORAGE_KEY } from "./locale.ts";

/** A fresh instance, so each case runs i18next's real first-visit detection. */
const freshInstance = async (): Promise<I18n> => {
  const instance = i18next.createInstance();
  await instance.use(LanguageDetector).init(i18nOptions);
  return instance;
};

const browserLanguages = (...languages: string[]) => vi.stubGlobal("navigator", { languages, language: languages[0] });

beforeEach(() => window.localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("first visit", () => {
  it("uses the browser language, collapsing regional variants", async () => {
    browserLanguages("en-US", "pl");
    const instance = await freshInstance();
    expect(getPreferredLocale(instance)).toBe("en");
    expect(instance.resolvedLanguage).toBe("en");
  });

  it("honors browser priority order, skipping unsupported languages", async () => {
    browserLanguages("de-DE", "pl-PL", "en");
    expect(getPreferredLocale(await freshInstance())).toBe("pl");
  });

  it("falls back to Polish when no browser language is supported", async () => {
    browserLanguages("de-DE", "fr");
    const instance = await freshInstance();
    expect(getPreferredLocale(instance)).toBe("pl");
    expect(instance.resolvedLanguage).toBe("pl");
  });
});

describe("explicit choice", () => {
  it("wins over browser detection", async () => {
    browserLanguages("en-US");
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "pl");
    const instance = await freshInstance();
    expect(getPreferredLocale(instance)).toBe("pl");
    expect(instance.resolvedLanguage).toBe("pl");
  });

  it("is ignored when the stored value is not a supported locale", async () => {
    browserLanguages("en-GB");
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "xx");
    expect(getPreferredLocale(await freshInstance())).toBe("en");
  });

  it("is persisted by rememberLocale", () => {
    rememberLocale("en");
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
  });

  it("is never written by detection or by a URL-driven switch", async () => {
    browserLanguages("en-US");
    await freshInstance();
    await activateLocale("en");
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
  });
});

describe("document", () => {
  it("keeps <html lang> and the title in sync with the active language", async () => {
    await i18n.changeLanguage("en");
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toBe("Zielony Koszyk");

    await i18n.changeLanguage("pl");
    expect(document.documentElement.lang).toBe("pl");
    expect(document.title).toBe("Zielony koszyk");
  });
});

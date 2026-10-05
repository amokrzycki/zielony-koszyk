import i18n, { type i18n as I18n, type InitOptions } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, LOCALES, type Locale, pickLocale, toLocale } from "./locale.ts";
import { DEFAULT_NAMESPACE, NAMESPACES, resources } from "./resources.ts";

/**
 * i18next owns the runtime locale. Initial value (first visit / bare URL): stored explicit choice, then
 * `navigator.languages`, then Polish. A localized URL overrides it via `activateLocale` before render.
 * `caches: []` keeps the detector read-only so a URL or the browser can never masquerade as an explicit choice.
 */
export const i18nOptions: InitOptions = {
  resources,
  ns: NAMESPACES,
  defaultNS: DEFAULT_NAMESPACE,
  supportedLngs: LOCALES,
  fallbackLng: DEFAULT_LOCALE,
  load: "languageOnly",
  initAsync: false,
  detection: { order: ["localStorage", "navigator"], lookupLocalStorage: LOCALE_STORAGE_KEY, caches: [] },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
};

void i18n.use(LanguageDetector).use(initReactI18next).init(i18nOptions);

const syncDocument = (language: string) => {
  const locale = toLocale(language) ?? DEFAULT_LOCALE;
  document.documentElement.lang = locale;
  document.title = i18n.t("app.title", { lng: locale });
};

if (typeof document !== "undefined") {
  syncDocument(i18n.language);
  i18n.on("languageChanged", syncDocument);
}

/** Active runtime locale, normalized (`i18n.language` can be a region tag such as `en-US` when detected from the browser). */
export const getActiveLocale = (): Locale => toLocale(i18n.resolvedLanguage ?? i18n.language) ?? DEFAULT_LOCALE;

/** The locale the user would get with no locale in the URL: explicit choice, then browser, then Polish. */
export const getPreferredLocale = (instance: I18n = i18n): Locale =>
  pickLocale(instance.services.languageDetector?.detect?.() as string | string[] | undefined);

/** Router-facing: make the URL's locale the active one. Resources are bundled, so this settles synchronously. */
export const activateLocale = async (locale: Locale) => {
  if (toLocale(i18n.language) !== locale) await i18n.changeLanguage(locale);
};

/** Persists an explicit choice so it wins over browser detection from now on. Navigation applies it. */
export const rememberLocale = (locale: Locale) => {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage can be blocked (private mode); the choice still applies for this session through the URL.
  }
};

export default i18n;

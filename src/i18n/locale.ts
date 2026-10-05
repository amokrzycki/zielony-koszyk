export const LOCALES = ["pl", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** Fallback for unsupported or undetectable languages, and the app's canonical locale. */
export const DEFAULT_LOCALE: Locale = "pl";

/** Written only when the user explicitly picks a language; never by URL or browser detection. */
export const LOCALE_STORAGE_KEY = "preferredLocale";

/** BCP 47 tags handed to `Intl`; the UI locale is language-only, formatting wants a region. */
export const LOCALE_TAGS: Record<Locale, string> = { pl: "pl-PL", en: "en-GB" };

/** Display names in their own language, so the switcher reads correctly whatever the active locale is. */
export const LOCALE_NAMES: Record<Locale, string> = { pl: "Polski", en: "English" };

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale);

/** Language-only matching: `en-US`, `EN_gb` and `en` all resolve to `en`. */
export const toLocale = (code: string | null | undefined): Locale | null => {
  const language = code?.trim().toLowerCase().split(/[-_]/)[0];
  return isLocale(language) ? language : null;
};

/** First supported entry wins (detector order = priority); anything unsupported is skipped. */
export const pickLocale = (codes: string | readonly string[] | null | undefined): Locale => {
  for (const code of typeof codes === "string" ? [codes] : (codes ?? [])) {
    const locale = toLocale(code);
    if (locale) return locale;
  }
  return DEFAULT_LOCALE;
};

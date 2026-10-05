import { LOCALE_TAGS, type Locale } from "./locale.ts";

/** Prices are always PLN; only the presentation follows the UI locale. */
export const CURRENCY = "PLN";

type DateInput = Date | string | number;

const formatters = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();

const cached = <T extends Intl.NumberFormat | Intl.DateTimeFormat>(key: string, create: () => T): T => {
  let formatter = formatters.get(key) as T | undefined;
  if (!formatter) {
    formatter = create();
    formatters.set(key, formatter);
  }
  return formatter;
};

export const formatCurrency = (value: number | string, locale: Locale) =>
  cached(
    `currency:${locale}`,
    () => new Intl.NumberFormat(LOCALE_TAGS[locale], { style: "currency", currency: CURRENCY }),
  ).format(Number(value));

export const formatNumber = (value: number | string, locale: Locale, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat(LOCALE_TAGS[locale], options).format(Number(value));

/** Warsaw time on purpose: it is a Polish shop, and it keeps output identical for every visitor. */
const TIME_ZONE = "Europe/Warsaw";

export const formatDate = (value: DateInput, locale: Locale) =>
  cached(
    `date:${locale}`,
    () => new Intl.DateTimeFormat(LOCALE_TAGS[locale], { dateStyle: "medium", timeZone: TIME_ZONE }),
  ).format(new Date(value));

export const formatDateTime = (value: DateInput, locale: Locale) =>
  cached(
    `datetime:${locale}`,
    () =>
      new Intl.DateTimeFormat(LOCALE_TAGS[locale], { dateStyle: "medium", timeStyle: "short", timeZone: TIME_ZONE }),
  ).format(new Date(value));

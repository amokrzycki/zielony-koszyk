import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DEFAULT_LOCALE, type Locale, toLocale } from "./locale.ts";
import { formatCurrency, formatDate, formatDateTime, formatNumber } from "./format.ts";
import { type PathArgs, pathFor, type RouteId, switchLocalePath } from "./routes.ts";

/** Active UI locale. Re-renders on change; also the value to put in localized RTK Query args. */
export const useLocale = (): Locale => {
  const { i18n } = useTranslation();
  return toLocale(i18n.resolvedLanguage ?? i18n.language) ?? DEFAULT_LOCALE;
};

type LocalePath = <Id extends RouteId>(id: Id, ...args: PathArgs<Id>) => string;

/** `pathFor` bound to the active locale: `const to = useLocalePath(); to("productDetails", { productId })`. */
export const useLocalePath = (): LocalePath => {
  const locale = useLocale();
  return useMemo<LocalePath>(
    () =>
      (id, ...args) =>
        pathFor(id, locale, ...args),
    [locale],
  );
};

/** The current page in another locale: same route, params, query and hash. */
export const useSwitchLocalePath = () => {
  const location = useLocation();
  return (target: Locale) => switchLocalePath(location, target);
};

/** Locale-bound `Intl` formatting; use instead of `toFixed`, hardcoded currency symbols or `toLocaleDateString`. */
export const useFormat = () => {
  const locale = useLocale();
  return useMemo(
    () => ({
      locale,
      currency: (value: number | string) => formatCurrency(value, locale),
      number: (value: number | string, options?: Intl.NumberFormatOptions) => formatNumber(value, locale, options),
      date: (value: Date | string | number) => formatDate(value, locale),
      dateTime: (value: Date | string | number) => formatDateTime(value, locale),
    }),
    [locale],
  );
};

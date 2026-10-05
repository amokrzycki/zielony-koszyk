import { matchPath } from "react-router-dom";
import { LOCALES, type Locale } from "./locale.ts";

/**
 * Stable semantic route ids -> localized path (relative to `/:locale`, no leading slash).
 * Components refer to ids only; the slugs below are the single place that knows about translated URLs.
 */
const ROUTES = {
  home: { pl: "", en: "" },
  products: { pl: "produkty", en: "products" },
  productDetails: { pl: "produkty/:productId", en: "products/:productId" },
  about: { pl: "o-nas", en: "about" },
  cart: { pl: "koszyk", en: "cart" },
  cartLogin: { pl: "logowanie-do-koszyka", en: "cart-login" },
  login: { pl: "logowanie", en: "login" },
  order: { pl: "zamowienie", en: "order" },
  orderSummary: { pl: "zamowienie/podsumowanie", en: "order/summary" },
  orderConfirmation: { pl: "zamowienie/potwierdzenie", en: "order/confirmation" },
  account: { pl: "konto", en: "account" },
  accountOrders: { pl: "konto/zamowienia", en: "account/orders" },
  accountOrderDetails: { pl: "konto/zamowienia/:orderId", en: "account/orders/:orderId" },
  accountAddresses: { pl: "konto/ksiazka-adresowa", en: "account/address-book" },
  accountAddressEdit: { pl: "konto/ksiazka-adresowa/edytuj-dane", en: "account/address-book/edit" },
  accountAddressAdd: { pl: "konto/ksiazka-adresowa/dodaj-adres", en: "account/address-book/add" },
  accountEmailChange: { pl: "konto/zmiana-email", en: "account/change-email" },
  accountPasswordChange: { pl: "konto/zmiana-hasla", en: "account/change-password" },
  accountMfa: { pl: "konto/mfa", en: "account/mfa" },
  admin: { pl: "admin", en: "admin" },
  adminProducts: { pl: "admin/zarzadzanie-produktami", en: "admin/products" },
  adminOrders: { pl: "admin/zarzadzanie-zamowieniami", en: "admin/orders" },
  adminOrderItems: { pl: "admin/zarzadzanie-zamowieniami/:orderId", en: "admin/orders/:orderId" },
  adminOrderEdit: {
    pl: "admin/zarzadzanie-zamowieniami/:orderId/edycja-danych-zamowienia",
    en: "admin/orders/:orderId/edit-details",
  },
  adminUsers: { pl: "admin/zarzadzanie-uzytkownikami", en: "admin/users" },
  adminUserEdit: { pl: "admin/zarzadzanie-uzytkownikami/edycja-uzytkownika", en: "admin/users/edit" },
  adminUserAdd: { pl: "admin/zarzadzanie-uzytkownikami/dodaj-uzytkownika", en: "admin/users/add" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteId = keyof typeof ROUTES;

type ParamNames<Pattern extends string> = Pattern extends `${string}:${infer Name}/${infer Rest}`
  ? Name | ParamNames<Rest>
  : Pattern extends `${string}:${infer Name}`
    ? Name
    : never;

export type RouteParams<Id extends RouteId> = Record<ParamNames<(typeof ROUTES)[Id]["pl"]>, string | number>;

export interface PathSuffix {
  search?: string;
  hash?: string;
}

export type PathArgs<Id extends RouteId> = [ParamNames<(typeof ROUTES)[Id]["pl"]>] extends [never]
  ? [params?: undefined, suffix?: PathSuffix]
  : [params: RouteParams<Id>, suffix?: PathSuffix];

const ROUTE_IDS = Object.keys(ROUTES) as RouteId[];

/** Path relative to `/:locale`, for building the router tree. Params stay as `:name` placeholders. */
export const routeSegment = (id: RouteId, locale: Locale): string => ROUTES[id][locale];

const fill = (pattern: string, params: Record<string, string | number> = {}) =>
  pattern.replace(/:(\w+)/g, (_, name: string) => encodeURIComponent(String(params[name])));

const buildPath = (id: RouteId, locale: Locale, params?: Record<string, string | number>, suffix?: PathSuffix) => {
  const segment = fill(ROUTES[id][locale], params);
  const search = suffix?.search ? (suffix.search.startsWith("?") ? suffix.search : `?${suffix.search}`) : "";
  const hash = suffix?.hash ? (suffix.hash.startsWith("#") ? suffix.hash : `#${suffix.hash}`) : "";
  return `/${locale}${segment ? `/${segment}` : ""}${search}${hash}`;
};

/** Absolute, locale-prefixed URL for a route id, e.g. `pathFor("productDetails", "en", { productId: 15 })` -> `/en/products/15`. */
export const pathFor = <Id extends RouteId>(id: Id, locale: Locale, ...[params, suffix]: PathArgs<Id>): string =>
  buildPath(id, locale, params, suffix);

export interface RouteMatch {
  id: RouteId;
  /** Locale of the URL that matched; `null` for legacy, unprefixed URLs. */
  locale: Locale | null;
  params: Record<string, string>;
}

const matchIn = (pathname: string, locale: Locale | null): RouteMatch | null => {
  for (const id of ROUTE_IDS) {
    // Legacy URLs carry a slug but no prefix, so every locale's slug is tried.
    for (const slugLocale of locale ? [locale] : LOCALES) {
      const segment = ROUTES[id][slugLocale];
      const pattern = `${locale ? `/${locale}` : ""}${segment ? `/${segment}` : ""}` || "/";
      const match = matchPath({ path: pattern, end: true }, pathname);
      if (match) return { id, locale, params: match.params as Record<string, string> };
    }
  }
  return null;
};

/** Resolves a pathname to its logical route, from either a `/:locale/...` URL or a legacy unprefixed one. */
export const matchRoute = (pathname: string): RouteMatch | null => {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) return matchIn(pathname, locale);
  }
  return matchIn(pathname, null);
};

interface LocationLike extends PathSuffix {
  pathname: string;
}

/** Same logical route and params in `target`; query string and hash are carried over. Unknown paths land on home. */
export const switchLocalePath = ({ pathname, search, hash }: LocationLike, target: Locale): string => {
  const match = matchRoute(pathname);
  if (!match) return pathFor("home", target, undefined, { search, hash });
  return buildPath(match.id, target, match.params, { search, hash });
};

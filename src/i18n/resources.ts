import plAccount from "./locales/pl/account.json";
import plAdmin from "./locales/pl/admin.json";
import plCatalog from "./locales/pl/catalog.json";
import plCheckout from "./locales/pl/checkout.json";
import plCommon from "./locales/pl/common.json";
import enAccount from "./locales/en/account.json";
import enAdmin from "./locales/en/admin.json";
import enCatalog from "./locales/en/catalog.json";
import enCheckout from "./locales/en/checkout.json";
import enCommon from "./locales/en/common.json";

/** Both bundles ship statically; `pl` is the source of truth that `i18next.d.ts` derives key types from. */
export const resources = {
  pl: { common: plCommon, catalog: plCatalog, checkout: plCheckout, account: plAccount, admin: plAdmin },
  en: { common: enCommon, catalog: enCatalog, checkout: enCheckout, account: enAccount, admin: enAdmin },
} as const;

export const DEFAULT_NAMESPACE = "common";
export const NAMESPACES = Object.keys(resources.pl) as (keyof typeof resources.pl)[];

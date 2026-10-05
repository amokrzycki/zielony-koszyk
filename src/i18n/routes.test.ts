import { describe, expect, it } from "vitest";
import { LOCALES } from "./locale.ts";
import { matchRoute, pathFor, routeSegment, type RouteId, switchLocalePath } from "./routes.ts";

const IDS = [
  "home",
  "products",
  "productDetails",
  "about",
  "cart",
  "cartLogin",
  "login",
  "order",
  "orderSummary",
  "orderConfirmation",
  "account",
  "accountOrders",
  "accountOrderDetails",
  "accountAddresses",
  "accountAddressEdit",
  "accountAddressAdd",
  "accountEmailChange",
  "accountPasswordChange",
  "accountMfa",
  "admin",
  "adminProducts",
  "adminOrders",
  "adminOrderItems",
  "adminOrderEdit",
  "adminUsers",
  "adminUserEdit",
  "adminUserAdd",
] as const satisfies readonly RouteId[];

describe("pathFor", () => {
  it("builds locale-prefixed URLs from semantic ids", () => {
    expect(pathFor("home", "pl")).toBe("/pl");
    expect(pathFor("home", "en")).toBe("/en");
    expect(pathFor("products", "pl")).toBe("/pl/produkty");
    expect(pathFor("products", "en")).toBe("/en/products");
    expect(pathFor("productDetails", "en", { productId: 15 })).toBe("/en/products/15");
    expect(pathFor("about", "pl")).toBe("/pl/o-nas");
    expect(pathFor("cart", "en")).toBe("/en/cart");
    expect(pathFor("order", "en")).toBe("/en/order");
  });

  it("appends query and hash, with or without their leading characters", () => {
    expect(pathFor("products", "en", undefined, { search: "category=owoce" })).toBe("/en/products?category=owoce");
    expect(pathFor("products", "en", undefined, { search: "?page=2", hash: "#top" })).toBe("/en/products?page=2#top");
  });

  it("encodes params", () => {
    expect(pathFor("accountOrderDetails", "pl", { orderId: "a/b" })).toBe("/pl/konto/zamowienia/a%2Fb");
  });
});

describe("route table", () => {
  it("lists every id once", () => {
    expect(new Set(IDS).size).toBe(IDS.length);
  });

  it.each(LOCALES)("has unambiguous URLs in %s", (locale) => {
    const urls = IDS.map((id) => routeSegment(id, locale).replace(/:\w+/g, ":p"));
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("uses the same params in every locale", () => {
    for (const id of IDS) {
      const params = (locale: "pl" | "en") => routeSegment(id, locale).match(/:\w+/g) ?? [];
      expect(params("en")).toEqual(params("pl"));
    }
  });

  it("round-trips every id through matchRoute in every locale", () => {
    for (const locale of LOCALES) {
      for (const id of IDS) {
        const params = Object.fromEntries(
          (routeSegment(id, locale).match(/:(\w+)/g) ?? []).map((p) => [p.slice(1), "7"]),
        );
        const match = matchRoute((pathFor as (...args: unknown[]) => string)(id, locale, params));
        expect(match).toMatchObject({ id, locale, params });
      }
    }
  });
});

describe("switchLocalePath", () => {
  it("keeps the logical route, its params, the query and the hash", () => {
    expect(switchLocalePath({ pathname: "/pl/produkty/15", search: "?page=2", hash: "#details" }, "en")).toBe(
      "/en/products/15?page=2#details",
    );
    expect(switchLocalePath({ pathname: "/en/account/orders/9", search: "", hash: "" }, "pl")).toBe(
      "/pl/konto/zamowienia/9",
    );
    expect(switchLocalePath({ pathname: "/pl", search: "", hash: "" }, "en")).toBe("/en");
    expect(switchLocalePath({ pathname: "/en/admin/orders/3/edit-details", search: "", hash: "" }, "pl")).toBe(
      "/pl/admin/zarzadzanie-zamowieniami/3/edycja-danych-zamowienia",
    );
  });

  it("keeps product filters, which are stable identifiers rather than translated text", () => {
    expect(
      switchLocalePath(
        { pathname: "/pl/produkty", search: "?category=owoce&orderBy=name&orderDir=ASC", hash: "" },
        "en",
      ),
    ).toBe("/en/products?category=owoce&orderBy=name&orderDir=ASC");
  });

  it("tolerates a trailing slash", () => {
    expect(switchLocalePath({ pathname: "/pl/produkty/", search: "", hash: "" }, "en")).toBe("/en/products");
  });

  it("lands on the target home page for an unknown path", () => {
    expect(switchLocalePath({ pathname: "/pl/nie-ma-takiej", search: "", hash: "" }, "en")).toBe("/en");
  });

  it("recognises legacy unprefixed URLs by either locale's slug", () => {
    expect(switchLocalePath({ pathname: "/produkty/15", search: "?page=2", hash: "" }, "en")).toBe(
      "/en/products/15?page=2",
    );
    expect(switchLocalePath({ pathname: "/products", search: "", hash: "" }, "pl")).toBe("/pl/produkty");
    expect(switchLocalePath({ pathname: "/", search: "", hash: "" }, "en")).toBe("/en");
  });
});

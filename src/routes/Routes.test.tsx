// @vitest-environment happy-dom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import i18n, { activateLocale } from "@/i18n/index.ts";
import { LOCALE_STORAGE_KEY, LOCALES } from "@/i18n/locale.ts";
import { RedirectToPreferredLocale, routes } from "./Routes.tsx";

const browser = (...languages: string[]) => vi.stubGlobal("navigator", { languages, language: languages[0] });

/** Runs the real route tree's loaders (no rendering, so no page components mount or hit the network). */
const open = async (url: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [url] });
  router.initialize();
  await vi.waitFor(() => expect(router.state.initialized).toBe(true));
  return router;
};

const roots: ReturnType<typeof createRoot>[] = [];

/** The real redirect component beside the real locale activation, rendered at `url`. */
const redirectFrom = async (url: string) => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const router = createMemoryRouter(
    [
      ...LOCALES.map((locale) => ({
        path: `/${locale}/*`,
        loader: async () => {
          await activateLocale(locale);
          return null;
        },
        element: <div />,
      })),
      { path: "*", element: <RedirectToPreferredLocale /> },
    ],
    { initialEntries: [url] },
  );
  const root = createRoot(document.createElement("div"));
  roots.push(root);
  await act(async () => root.render(<RouterProvider router={router} />));
  await vi.waitFor(() => expect(router.state.navigation.state).toBe("idle"));
  return router;
};

beforeEach(() => window.localStorage.clear());
afterEach(async () => {
  await act(async () => {
    for (const root of roots.splice(0)) root.unmount();
  });
  vi.unstubAllGlobals();
});

describe("locale in the URL", () => {
  it("decides the language of a deep link, whatever the browser prefers", async () => {
    browser("pl-PL");

    const router = await open("/en/products/15?page=2#details");

    expect(router.state.location.pathname).toBe("/en/products/15");
    expect(i18n.resolvedLanguage).toBe("en");
    expect(document.documentElement.lang).toBe("en");
  });

  it("wins over an earlier explicit choice, without overwriting it", async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "pl");

    await open("/en");

    expect(i18n.resolvedLanguage).toBe("en");
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("pl");
  });

  it("serves every prefix in its own language", async () => {
    await open("/pl/produkty");
    expect(i18n.resolvedLanguage).toBe("pl");
    await open("/en/products");
    expect(i18n.resolvedLanguage).toBe("en");
  });
});

describe("unprefixed URLs", () => {
  it("send a first-time visitor to their browser's language, replacing the history entry", async () => {
    browser("en-US");

    const router = await redirectFrom("/");

    expect(router.state.location.pathname).toBe("/en");
    expect(router.state.historyAction).toBe("REPLACE");
    expect(i18n.resolvedLanguage).toBe("en");
  });

  it("prefer a stored explicit choice over the browser", async () => {
    browser("en-US");
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "pl");

    expect((await redirectFrom("/")).state.location.pathname).toBe("/pl");
  });

  it("fall back to Polish for unsupported browser languages", async () => {
    browser("ja-JP");

    expect((await redirectFrom("/")).state.location.pathname).toBe("/pl");
  });

  it("keep the logical route, params, query and hash for a bookmarked legacy URL", async () => {
    browser("en");

    const router = await redirectFrom("/produkty/15?page=2#details");

    expect(router.state.location).toMatchObject({ pathname: "/en/products/15", search: "?page=2", hash: "#details" });
  });

  it("send unknown paths to the home page of the preferred language", async () => {
    browser("pl");

    expect((await redirectFrom("/xx/whatever")).state.location.pathname).toBe("/pl");
  });
});

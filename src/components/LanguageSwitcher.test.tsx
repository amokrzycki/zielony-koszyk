// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import i18n, { activateLocale } from "@/i18n/index.ts";
import { LOCALE_STORAGE_KEY, LOCALES } from "@/i18n/locale.ts";
import LanguageSwitcher from "./LanguageSwitcher.tsx";

let root: Root | undefined;

/** The switcher on a pair of mirrored routes, wired to the same locale activation as the real router. */
const renderAt = async (url: string) => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const router = createMemoryRouter(
    LOCALES.map((locale) => ({
      path: `/${locale}`,
      loader: async () => {
        await activateLocale(locale);
        return null;
      },
      element: (
        <>
          <LanguageSwitcher />
          <Outlet />
        </>
      ),
      children: [
        { path: locale === "pl" ? "produkty/:productId" : "products/:productId", element: <p id="page">{locale}</p> },
      ],
    })),
    { initialEntries: [url] },
  );
  const container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root?.render(<RouterProvider router={router} />));
  await vi.waitFor(() => expect(router.state.navigation.state).toBe("idle"));
  return { router, container };
};

const button = (container: HTMLElement, locale: string) =>
  container.querySelector<HTMLButtonElement>(`button[lang="${locale}"]`) as HTMLButtonElement;

beforeEach(() => window.localStorage.clear());
afterEach(async () => {
  await act(async () => root?.unmount());
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("LanguageSwitcher", () => {
  it("exposes the language group, names and current state to assistive tech", async () => {
    const { container } = await renderAt("/pl/produkty/15");

    const group = container.querySelector('[role="group"]');
    expect(group?.getAttribute("aria-label")).toBe("Język");
    expect(button(container, "pl").getAttribute("aria-label")).toBe("Polski");
    expect(button(container, "en").getAttribute("aria-label")).toBe("English");
    expect(button(container, "pl").getAttribute("aria-pressed")).toBe("true");
    expect(button(container, "en").getAttribute("aria-pressed")).toBe("false");
    // Visible text is the short code, not a flag.
    expect(button(container, "en").textContent).toBe("EN");
  });

  it("switches language on the same page, keeping params, query and hash", async () => {
    const { router, container } = await renderAt("/pl/produkty/15?page=2#details");

    await act(async () => button(container, "en").click());
    await vi.waitFor(() => expect(router.state.location.pathname).toBe("/en/products/15"));

    expect(router.state.location).toMatchObject({ search: "?page=2", hash: "#details" });
    expect(i18n.resolvedLanguage).toBe("en");
    expect(document.documentElement.lang).toBe("en");
    expect(container.querySelector('[role="group"]')?.getAttribute("aria-label")).toBe("Language");
    expect(button(container, "en").getAttribute("aria-pressed")).toBe("true");
  });

  it("persists the explicit choice", async () => {
    const { container } = await renderAt("/pl/produkty/15");

    await act(async () => button(container, "en").click());

    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
  });

  it("does nothing when the current language is chosen again", async () => {
    const { router, container } = await renderAt("/pl/produkty/15");

    await act(async () => button(container, "pl").click());

    expect(router.state.location.pathname).toBe("/pl/produkty/15");
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
  });
});

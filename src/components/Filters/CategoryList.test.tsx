// @vitest-environment happy-dom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { expect, it, vi } from "vitest";
import CategoryList from "./CategoryList.tsx";

it("updates and clears category with page reset while preserving other filters", async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const router = createMemoryRouter([{ path: "/produkty", element: <CategoryList /> }], {
    initialEntries: ["/produkty?orderBy=price&orderDir=DESC&page=3&pageSize=48&search=banan&priceMin=5&priceMax=20"],
  });
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    await act(async () => root.render(<RouterProvider router={router} />));
    await act(async () => container.querySelector<HTMLButtonElement>('button[value="owoce"]')?.click());
    expect(Object.fromEntries(new URLSearchParams(router.state.location.search))).toEqual({
      category: "owoce",
      page: "1",
      orderBy: "price",
      orderDir: "DESC",
      pageSize: "48",
      search: "banan",
      priceMin: "5",
      priceMax: "20",
    });
    await act(async () => {
      await router.navigate(`/produkty${router.state.location.search.replace("page=1", "page=2")}`);
    });
    const clear = [...container.querySelectorAll("button")].find((button) => button.textContent === "Wyczyść");
    await act(async () => clear?.click());
    expect(Object.fromEntries(new URLSearchParams(router.state.location.search))).toEqual({
      category: "",
      page: "1",
      orderBy: "price",
      orderDir: "DESC",
      pageSize: "48",
      search: "banan",
      priceMin: "5",
      priceMax: "20",
    });
  } finally {
    await act(async () => root.unmount());
    router.dispose();
    vi.unstubAllGlobals();
  }
});

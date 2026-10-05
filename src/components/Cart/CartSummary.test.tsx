// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CartSummary from "./CartSummary.tsx";
import i18n from "@/i18n/index.ts";

const mocks = vi.hoisted(() => ({
  state: {
    cart: {
      items: [
        { productId: 1, name: "Pomidory (snapshot)", quantity: 3, price: 12.5 },
        { productId: 2, name: "Stara nazwa", quantity: 1, price: 5 },
      ],
    },
  },
}));

vi.mock("react-redux", () => ({
  useSelector: (selector: (state: typeof mocks.state) => unknown) => selector(mocks.state),
}));

// The catalogue answers in the requested locale; product 2 is missing to exercise the persisted-name fallback.
vi.mock("@/components/Products/productsApiSlice.ts", () => ({
  useGetProductsQuery: ({ locale }: { locale: "pl" | "en" }) => ({
    data: [{ product_id: 1, name: locale === "en" ? "Tomatoes" : "Pomidory" }],
  }),
}));

describe("CartSummary", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(async () => {
    await i18n.changeLanguage("pl");
    container = document.createElement("div");
    document.body.replaceChildren(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
  });

  const render = () => act(async () => root.render(<CartSummary />));

  it("shows Polish copy, złoty amounts and the catalogue name", async () => {
    await render();

    const text = container.textContent ?? "";
    expect(text).toContain("Podsumowanie");
    expect(text).toContain("Pomidory");
    expect(text).not.toContain("snapshot");
    expect(text).toContain("Stara nazwa");
    expect(text).toMatch(/3 szt\. × 12,50\s*zł/);
    expect(text).toMatch(/Razem\s*52,50\s*zł/);
    expect(text).toMatch(/Dostawa\s*10,00\s*zł/);
  });

  it("switches to English copy, GBP-style grouping of PLN and the English product name", async () => {
    await i18n.changeLanguage("en");
    await render();

    const text = container.textContent ?? "";
    expect(text).toContain("Summary");
    expect(text).toContain("Tomatoes");
    expect(text).toMatch(/3 pcs × PLN\s*12\.50/);
    expect(text).toMatch(/Total\s*PLN\s*52\.50/);
    expect(text).toMatch(/Delivery\s*PLN\s*10\.00/);
    expect(text).not.toContain("Razem");
  });
});

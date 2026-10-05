// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "@/i18n/index.ts";
import { Categories } from "@/enums/Categories.ts";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";
import Navigation from "./Navigation.tsx";
import AddProductForm from "./Products/AddProductForm.tsx";

const mocks = vi.hoisted(() => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}));

vi.mock("@/components/Products/productsApiSlice.ts", () => ({
  useCreateProductMutation: () => [mocks.createProduct],
  useUpdateProductMutation: () => [mocks.updateProduct],
}));

describe("Admin localization", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    mocks.createProduct.mockReset();
    mocks.updateProduct.mockReset();
    container = document.createElement("div");
    document.body.replaceChildren(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
  });

  const render = (node: React.ReactNode) => act(async () => root.render(node));
  const text = () => document.body.textContent ?? "";

  describe("ConfirmDeleteModal", () => {
    const renderModal = (count: number) =>
      render(
        <ConfirmDeleteModal open entity="products" count={count} handleClose={vi.fn()} onConfirm={async () => {}} />,
      );

    it.each([
      [1, "Usunąć 1 produkt?"],
      [3, "Usunąć 3 produkty?"],
      [5, "Usunąć 5 produktów?"],
    ])("uses Polish plural forms (%i)", async (count, title) => {
      await renderModal(count);
      expect(text()).toContain(title);
      expect(text()).toContain("Tej operacji nie można cofnąć.");
    });

    it("renders English copy", async () => {
      await i18n.changeLanguage("en");
      await renderModal(2);
      expect(text()).toContain("Delete 2 products?");
      expect(text()).toContain("This action cannot be undone.");
      expect(text()).toContain("Cancel");
    });
  });

  describe("Navigation", () => {
    const renderNav = (path: string) =>
      render(
        <MemoryRouter initialEntries={[path]}>
          <Navigation />
        </MemoryRouter>,
      );

    it("marks the section of a nested order route as current, whatever the locale", async () => {
      await i18n.changeLanguage("en");
      await renderNav("/en/admin/orders/5/edit-details");

      const current = container.querySelector('[aria-current="page"]');
      expect(current?.textContent).toContain("Orders");
      expect(container.querySelector("nav")?.getAttribute("aria-label")).toBe("Admin navigation");
    });

    it("renders Polish labels", async () => {
      await renderNav("/pl/admin/zarzadzanie-produktami");
      expect(container.querySelector('[aria-current="page"]')?.textContent).toContain("Produkty");
      expect(text()).toContain("Realizacja i statusy");
    });
  });

  describe("AddProductForm", () => {
    it("groups shared and per-language fields in Polish", async () => {
      await render(<AddProductForm handleClose={vi.fn()} />);

      expect(container.querySelector('input[type="file"]')).not.toBeNull();
      expect(text()).toContain("Nazwa produktu (Polski)");
      expect(text()).toContain("Opis produktu (English)");
      expect(text()).toContain("Cena (PLN)");
      expect(container.querySelectorAll("form > div > fieldset")).toHaveLength(3);
    });

    it("renders English labels", async () => {
      await i18n.changeLanguage("en");
      await render(<AddProductForm handleClose={vi.fn()} />);

      expect(text()).toContain("Product name (Polski)");
      expect(text()).toContain("Product description (English)");
      expect(text()).toContain("Price (PLN)");
      expect(text()).toContain("Add product");
    });

    it.each([0, 4])("edits both languages with stock %i and hides the image picker", async (stock) => {
      mocks.updateProduct.mockReturnValue({ unwrap: () => Promise.resolve({}) });
      const handleClose = vi.fn();
      await render(
        <AddProductForm
          handleClose={handleClose}
          product={{
            id: 7,
            price: 12.5,
            category: Categories.VEGETABLES,
            stock_quantity: stock,
            translations: {
              pl: { name: "Marchew", description: "Słodka marchew" },
              en: { name: "Carrot", description: "Sweet carrot" },
            },
          }}
        />,
      );

      expect(container.querySelector('input[type="file"]')).toBeNull();
      const values = Array.from(
        container.querySelectorAll("input:not([aria-hidden]), textarea:not([aria-hidden])"),
      ).map((element) => (element as HTMLInputElement).value);
      expect(values).toEqual(expect.arrayContaining(["Marchew", "Słodka marchew", "Carrot", "Sweet carrot"]));

      await act(async () => {
        container.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });

      expect(mocks.updateProduct).toHaveBeenCalledWith({
        id: 7,
        product: {
          price: 12.5,
          category: Categories.VEGETABLES,
          stock_quantity: stock,
          translations: {
            pl: { name: "Marchew", description: "Słodka marchew" },
            en: { name: "Carrot", description: "Sweet carrot" },
          },
        },
      });
      expect(mocks.createProduct).not.toHaveBeenCalled();
    });

    it.each([-1, 1.5])("rejects invalid stock %s before saving an edit", async (stock) => {
      mocks.updateProduct.mockReturnValue({ unwrap: () => Promise.resolve({}) });
      await render(
        <AddProductForm
          handleClose={vi.fn()}
          product={{
            id: 7,
            price: 12.5,
            category: Categories.VEGETABLES,
            stock_quantity: stock,
            translations: {
              pl: { name: "Marchew", description: "Słodka marchew" },
              en: { name: "Carrot", description: "Sweet carrot" },
            },
          }}
        />,
      );

      await act(async () => {
        container.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });

      expect(mocks.updateProduct).not.toHaveBeenCalled();
      expect(text()).toContain("Podaj ilość w magazynie");
    });

    it("requires all four localized fields", async () => {
      await render(<AddProductForm handleClose={vi.fn()} />);
      await act(async () => {
        container.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });

      expect(mocks.createProduct).not.toHaveBeenCalled();
      expect(text().match(/Podaj nazwę produktu/g)).toHaveLength(2);
      expect(text().match(/Podaj opis produktu/g)).toHaveLength(2);
    });
  });
});

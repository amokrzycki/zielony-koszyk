// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AccountOrderDetails from "./AccountOrderDetails.tsx";
import { OrderStatuses } from "@/enums/OrderStatuses.ts";
import { OrderType } from "@/enums/OrderType.ts";
import { CustomerType } from "@/enums/CustomerType.ts";

const mocks = vi.hoisted(() => ({
  items: {
    data: [] as unknown[],
    isLoading: false,
    isError: false,
  },
  order: {
    data: undefined as unknown,
    isLoading: false,
    isError: false,
  },
}));

vi.mock("../../Order/orderApiSlice.ts", () => ({
  useGetOrderQuery: () => mocks.order,
  useGetInvoiceQuery: () => ({ data: null, isFetching: false, isError: false }),
}));

vi.mock("../../Order/orderItemsApiSlice.ts", () => ({
  useGetOrderItemsQuery: () => mocks.items,
}));

const address = {
  address_id: 1,
  first_name: "Anna",
  last_name: "Kowalska",
  phone: "123456789",
  customer_type: CustomerType.PERSON,
  type: "BILLING",
  default: false,
  street: "Kwiatowa",
  building_number: "12",
  flat_number: "3",
  city: "Rzeszów",
  zip: "35-001",
};

describe("AccountOrderDetails", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.items = { data: [], isLoading: false, isError: false };
    mocks.order = {
      data: {
        order_id: 1042,
        order_type: OrderType.PRIVATE,
        customer_email: "anna@example.com",
        status: OrderStatuses.IN_PROGRESS,
        order_date: "2025-05-12T14:30:00",
        total_amount: "29.50",
        billingAddress: address,
        shippingAddress: address,
      },
      isLoading: false,
      isError: false,
    };
    container = document.createElement("div");
    document.body.replaceChildren(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
  });

  const render = async () =>
    act(async () =>
      root.render(
        <MemoryRouter>
          <AccountOrderDetails />
        </MemoryRouter>,
      ),
    );

  it("shows the order summary with a total and the Polish item count", async () => {
    mocks.items.data = [
      { order_item_id: 1, product_name: "Pomidory", quantity: 2, price: "12.00" },
      { order_item_id: 2, product_name: "Oliwa", quantity: 1, price: "5.50" },
    ];

    await render();

    expect(container.textContent).toContain("Zamówienie #1042");
    expect(container.textContent).toContain("W trakcie realizacji");
    expect(container.textContent).toContain("2 pozycje");
    expect(container.textContent).toContain("Razem");
    expect(container.textContent).toContain("29.50 zł");
    expect(container.textContent).toContain("Dane do faktury");
    expect(container.textContent).toContain("Dostawa");
    expect(container.textContent).toContain("Osoba prywatna");
  });

  it("uses the singular form for a single line item", async () => {
    mocks.items.data = [{ order_item_id: 1, product_name: "Pomidory", quantity: 1, price: "12.00" }];

    await render();

    expect(container.textContent).toContain("1 pozycja");
  });

  it("falls back to an error view when the order is missing", async () => {
    mocks.order.data = undefined;

    await render();

    expect(container.textContent).toContain("Nie udało się pobrać danych zamówienia");
  });
});

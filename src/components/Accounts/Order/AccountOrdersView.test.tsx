// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AccountOrdersView from "./AccountOrdersView.tsx";
import { OrderStatuses } from "@/enums/OrderStatuses.ts";

const mocks = vi.hoisted(() => ({
  orders: {
    data: [] as unknown[],
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  },
}));

vi.mock("@/hooks/hooks.ts", () => ({
  useAppSelector: (selector: (state: unknown) => unknown) => selector({ auth: { user: { user_id: "user-1" } } }),
}));

vi.mock("../../Order/orderApiSlice.ts", () => ({
  useGetUserOrdersQuery: () => mocks.orders,
}));

describe("AccountOrdersView", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mocks.orders = { data: [], isLoading: false, isFetching: false, isError: false, refetch: vi.fn() };
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
          <AccountOrdersView />
        </MemoryRouter>,
      ),
    );

  it("invites a shopper with no orders to the catalogue", async () => {
    await render();

    expect(container.textContent).toContain("Nie masz jeszcze zamówień");
    expect(container.querySelector('a[href="/produkty"]')).not.toBeNull();
  });

  it("lists an order with its localized status, formatted amount and detail link", async () => {
    mocks.orders.data = [
      {
        order_id: 1042,
        status: OrderStatuses.IN_PROGRESS,
        total_amount: "1234.5",
        order_date: "2025-05-12T14:30:00",
      },
    ];

    await render();

    expect(container.textContent).toContain("#1042");
    expect(container.textContent).toContain("W trakcie realizacji");
    expect(container.textContent).toContain("1234.50");
    expect(container.querySelector('a[href="/konto/zamowienia/1042"]')).not.toBeNull();
  });
});

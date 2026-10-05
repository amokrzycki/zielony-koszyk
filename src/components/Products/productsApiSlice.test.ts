// @vitest-environment happy-dom

import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { baseApi } from "@/api/api.ts";
import { accountSlice } from "@/components/Accounts/accountSlice.ts";
import { productsApiSlice } from "./productsApiSlice.ts";

const NAMES = { pl: "Banan", en: "Banana" } as const;

const makeStore = () =>
  configureStore({
    reducer: { auth: accountSlice.reducer, [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

let calls: { url: string; language: string | null }[];

beforeEach(() => {
  calls = [];
  // The fake backend localizes by Accept-Language exactly like the real one.
  vi.stubGlobal(
    "fetch",
    vi.fn(async (request: Request) => {
      const language = request.headers.get("accept-language") as keyof typeof NAMES;
      calls.push({ url: new URL(request.url).pathname + new URL(request.url).search, language });
      const product = { product_id: 1, name: NAMES[language], description: "", price: 6.5, category: "owoce" };
      const { pathname } = new URL(request.url);
      const body = pathname.endsWith("/products")
        ? [product]
        : request.url.includes("/search")
          ? { data: [product], totalCount: 1, currentPage: 1, pageSize: 24, totalPages: 1 }
          : product;
      return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" } });
    }),
  );
});

afterEach(() => vi.unstubAllGlobals());

describe("localized product queries", () => {
  it("never serve one language's cached product for the other", async () => {
    const store = makeStore();
    const get = (locale: "pl" | "en") =>
      store.dispatch(productsApiSlice.endpoints.getProductById.initiate({ id: 1, locale })).unwrap();

    expect((await get("pl")).name).toBe("Banan");
    expect((await get("en")).name).toBe("Banana");
    // Back to Polish: served from cache (no third request) and still Polish.
    expect((await get("pl")).name).toBe("Banan");

    expect(calls.map((call) => call.language)).toEqual(["pl", "en"]);
  });

  it("keeps the request header in step with the cache key", async () => {
    const store = makeStore();

    await store.dispatch(productsApiSlice.endpoints.getProducts.initiate({ locale: "en" })).unwrap();

    expect(calls).toEqual([{ url: "/products", language: "en" }]);
  });

  it("isolates paginated search by locale and keeps locale out of the query string", async () => {
    const store = makeStore();
    const search = (locale: "pl" | "en") =>
      store
        .dispatch(productsApiSlice.endpoints.getProductsByParams.initiate({ search: "ban", page: 1, locale }))
        .unwrap();

    expect((await search("pl")).data[0].name).toBe("Banan");
    expect((await search("en")).data[0].name).toBe("Banana");

    expect(calls).toHaveLength(2);
    for (const call of calls) {
      expect(call.url).toContain("search=ban");
      expect(call.url).not.toContain("locale");
    }
    expect(calls.map((call) => call.language)).toEqual(["pl", "en"]);
  });

  it("refetches every cached language of a product after it is edited", async () => {
    const store = makeStore();
    const dispatchGet = (locale: "pl" | "en") =>
      store.dispatch(productsApiSlice.endpoints.getProductById.initiate({ id: 1, locale }));
    const subscriptions = [dispatchGet("pl"), dispatchGet("en")];
    await Promise.all(subscriptions.map((subscription) => subscription.unwrap()));
    expect(calls).toHaveLength(2);

    store.dispatch(baseApi.util.invalidateTags([{ type: "Products", id: 1 }]));

    await vi.waitFor(() => expect(calls).toHaveLength(4));
    for (const subscription of subscriptions) subscription.unsubscribe();
  });
});

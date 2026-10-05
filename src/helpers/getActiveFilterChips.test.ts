import { expect, it } from "vitest";
import i18n from "@/i18n/index.ts";
import type { Locale } from "@/i18n/locale.ts";
import { getActiveFilterChips } from "./getActiveFilterChips.ts";

const chipsFor = (locale: Locale, filters: Parameters<typeof getActiveFilterChips>[0]) =>
  getActiveFilterChips(filters, { t: i18n.getFixedT(locale, ["catalog", "common"]), locale });

it("builds removable chips for each active filter and clears only that filter", () => {
  const chips = chipsFor("pl", { search: "banan", category: "owoce", priceMin: 5, priceMax: 20 });

  expect(chips.map((chip) => chip.key)).toEqual(["search", "category", "price"]);
  expect(chips[0].label).toBe("Szukaj: „banan”");
  expect(chips[1].label).toBe("Kategoria: Owoce");
  expect(chips[1].clear).toEqual({ category: "", page: "1" });
  expect(chips[2].clear).toEqual({ priceMin: "0", priceMax: "500", page: "1" });
});

it("localizes chip labels and formats the price range through Intl", () => {
  const filters = { search: "apple", category: "inne", priceMin: 5, priceMax: 20 };
  const [search, category, price] = chipsFor("en", filters);

  expect(search.label).toBe("Search: “apple”");
  expect(category.label).toBe("Category: Groceries");
  expect(price.label).toBe("Price: PLN\u00a05–20");
  expect(chipsFor("pl", filters)[2].label).toMatch(/^Cena: 5–20\s*zł$/);
});

it("returns no chips for default filters and ignores an unknown category", () => {
  expect(chipsFor("pl", { search: "", category: "", priceMin: 0, priceMax: 500 })).toEqual([]);
  expect(chipsFor("pl", { category: "nie-ma-takiej" })).toEqual([]);
});

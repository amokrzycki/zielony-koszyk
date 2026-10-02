import { expect, it } from "vitest";
import { getActiveFilterChips } from "./getActiveFilterChips.ts";

it("builds removable chips for each active filter and clears only that filter", () => {
  const chips = getActiveFilterChips({ search: "banan", category: "owoce", priceMin: 5, priceMax: 20 });

  expect(chips.map((chip) => chip.key)).toEqual(["search", "category", "price"]);
  expect(chips[0].label).toBe("Szukaj: „banan”");
  expect(chips[1].clear).toEqual({ category: "", page: "1" });
  expect(chips[2].clear).toEqual({ priceMin: "0", priceMax: "500", page: "1" });
});

it("returns no chips for default filters and ignores an unknown category", () => {
  expect(getActiveFilterChips({ search: "", category: "", priceMin: 0, priceMax: 500 })).toEqual([]);
  expect(getActiveFilterChips({ category: "nie-ma-takiej" })).toEqual([]);
});

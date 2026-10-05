import { describe, expect, it } from "vitest";
import { API_ERROR_CODES } from "@/helpers/apiError.ts";
import { Categories } from "@/enums/Categories.ts";
import { OrderStatuses } from "@/enums/OrderStatuses.ts";
import { resources } from "./resources.ts";
import i18n from "./index.ts";

type Tree = { [key: string]: string | Tree };

const PLURAL = /_(zero|one|two|few|many|other)$/;

const entries = (tree: Tree, prefix = ""): [string, string][] =>
  Object.entries(tree).flatMap(([key, value]): [string, string][] => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [[path, value]] : entries(value, path);
  });

const flatten = (tree: Tree): Record<string, string> => Object.fromEntries(entries(tree));

const baseKeys = (flat: Record<string, string>) => new Set(Object.keys(flat).map((key) => key.replace(PLURAL, "")));
const variables = (text: string) => [...text.matchAll(/{{\s*(\w+)[^}]*}}/g)].map((match) => match[1]).sort();

const namespaces = Object.keys(resources.pl) as (keyof typeof resources.pl)[];

describe.each(namespaces)("namespace %s", (ns) => {
  const pl = flatten(resources.pl[ns] as Tree);
  const en = flatten(resources.en[ns] as Tree);

  it("has the same keys in Polish and English", () => {
    expect([...baseKeys(en)].sort()).toEqual([...baseKeys(pl)].sort());
  });

  it("uses the same interpolation variables for every key", () => {
    for (const key of Object.keys(pl)) {
      const counterpart = key.replace(PLURAL, "");
      const enKey = Object.keys(en).find((candidate) => candidate.replace(PLURAL, "") === counterpart);
      expect(enKey, key).toBeDefined();
      expect(variables(en[enKey as string]), key).toEqual(variables(pl[key]));
    }
  });

  it("has no empty strings", () => {
    for (const text of [...Object.values(pl), ...Object.values(en)]) expect(text.trim()).not.toBe("");
  });

  it("defines every plural form each language needs", () => {
    const forms = (flat: Record<string, string>, base: string) =>
      Object.keys(flat)
        .filter((key) => key.startsWith(`${base}_`) && PLURAL.test(key))
        .map((key) => key.replace(`${base}_`, ""))
        .sort();
    const bases = new Set(
      Object.keys(pl)
        .filter((key) => PLURAL.test(key))
        .map((key) => key.replace(PLURAL, "")),
    );
    for (const base of bases) {
      expect(forms(pl, base), base).toEqual(["few", "many", "one", "other"]);
      expect(forms(en, base), base).toEqual(["one", "other"]);
    }
  });
});

describe("identifiers that need a label", () => {
  const common = flatten(resources.pl.common as Tree);

  it.each(Object.values(Categories))("category %s", (id) => {
    expect(common[`categories.${id}`]).toBeTruthy();
  });

  it.each(Object.values(OrderStatuses))("order status %s", (status) => {
    expect(common[`orderStatus.${status}`]).toBeTruthy();
  });

  it.each(API_ERROR_CODES)("API error code %s", (code) => {
    expect(common[`errors.${code}`]).toBeTruthy();
  });
});

describe("plural rules", () => {
  it("picks Polish forms for 1, 2-4, 5+ and fractions", async () => {
    const t = i18n.getFixedT("pl", "common");
    expect(t("quantity.items", { count: 1 })).toBe("1 produkt");
    expect(t("quantity.items", { count: 3 })).toBe("3 produkty");
    expect(t("quantity.items", { count: 5 })).toBe("5 produktów");
    expect(t("quantity.items", { count: 22 })).toBe("22 produkty");
  });

  it("picks English forms", async () => {
    const t = i18n.getFixedT("en", "common");
    expect(t("quantity.items", { count: 1 })).toBe("1 item");
    expect(t("quantity.items", { count: 2 })).toBe("2 items");
    expect(t("quantity.pieces", { count: 1 })).toBe("1 pc");
    expect(t("quantity.pieces", { count: 4 })).toBe("4 pcs");
  });
});

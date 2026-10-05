import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store.ts";
import { useGetProductsQuery } from "@/components/Products/productsApiSlice.ts";
import { useLocale } from "@/i18n/useLocale.ts";
import type CartItem from "@/types/CartItem.ts";

/**
 * Cart items with `name` in the active locale. The persisted name is only a snapshot from whenever the item was added,
 * so it is overlaid with the catalog name and kept as the fallback while loading or if the product is gone.
 */
export const useLocalizedCartItems = (): CartItem[] => {
  const items = useSelector((state: RootState) => state.cart.items);
  const locale = useLocale();
  const { data: products } = useGetProductsQuery({ locale });

  return useMemo(() => {
    if (!products) return items;
    const names = new Map(products.map((product) => [product.product_id, product.name]));
    return items.map((item: CartItem) => ({ ...item, name: names.get(item.productId) ?? item.name }));
  }, [items, products]);
};

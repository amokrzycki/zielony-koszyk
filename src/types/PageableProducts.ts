import Product from "./Product.ts";

export interface PageableProducts {
  data: Product[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

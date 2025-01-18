export interface ProductParams {
  search?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDir?: "ASC" | "DESC";
}

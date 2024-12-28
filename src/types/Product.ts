import { Categories } from "../enums/Categories.ts";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category: Categories;
  stock_quantity: number;
  created_at: Date;
}

export default Product;

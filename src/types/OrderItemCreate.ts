import { OrderItem } from "./OrderItem.ts";

export interface OrderItemCreate extends OrderItem {
  order_id: number;
  product_name: string;
}

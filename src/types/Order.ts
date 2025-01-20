import { OrderItem } from "./OrderItem.ts";
import { OrderType } from "@/enums/OrderType.ts";

export interface Order {
  order_id?: string;
  user_id?: string;
  order_type: OrderType;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  orderDetails: OrderItem[];
}

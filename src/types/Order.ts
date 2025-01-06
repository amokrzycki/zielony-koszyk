import { OrderStatuses } from "../enums/OrderStatuses.ts";
import { OrderDetail } from "./OrderDetail.ts";

export interface Order {
  order_id?: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  status: OrderStatuses;
  orderDetails: OrderDetail[];
}

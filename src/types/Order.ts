import User from "./User.ts";
import { OrderStatuses } from "../enums/OrderStatuses.ts";
import { OrderDetail } from "./OrderDetail.ts";

export interface Order {
  user?: User;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  status: OrderStatuses;
  orderDetails: OrderDetail[];
}

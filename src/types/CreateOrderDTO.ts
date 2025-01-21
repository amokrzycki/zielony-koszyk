import { OrderItem } from "./OrderItem.ts";
import { OrderType } from "@/enums/OrderType.ts";
import { Address } from "@/types/Address.ts";

export interface CreateOrderDTO {
  user_id?: string;
  order_type: OrderType;
  nip?: string;
  customer_email: string;
  billing_address: Address;
  shipping_address: Address;
  same_address?: boolean;
  orderDetails: OrderItem[];
}

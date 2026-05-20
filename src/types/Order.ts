import type { OrderType } from "@/enums/OrderType.ts";
import type { Address } from "@/types/Address.ts";
import type { OrderItem } from "@/types/OrderItem.ts";

export interface Order {
  order_id: number;
  user_id?: string;
  order_type: OrderType;
  nip?: string;
  customer_email: string;
  billingAddress: Address;
  shippingAddress: Address;
  order_date: string;
  total_amount: string;
  status: string;
  orderItems: OrderItem[];
  invoice_path?: string;
}

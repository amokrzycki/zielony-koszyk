import type { OrderItem } from "./OrderItem.ts";
import type { OrderType } from "@/enums/OrderType.ts";
import type { CreateAddress } from "@/types/CreateAddress.ts";
import type { Address } from "@/types/Address.ts";

export interface CreateOrder {
  user_id?: string;
  order_type: OrderType;
  customer_email: string;
  nip?: string;
  billingAddress: CreateAddress | Address;
  shippingAddress: CreateAddress | Address;
  same_address?: boolean;
  orderItems: OrderItem[];
}

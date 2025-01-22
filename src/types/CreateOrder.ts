import { OrderItem } from "./OrderItem.ts";
import { OrderType } from "@/enums/OrderType.ts";
import { CreateAddress } from "@/types/CreateAddress.ts";
import { Address } from "@/types/Address.ts";

export interface CreateOrder {
  user_id?: string;
  order_type: OrderType;
  customer_email: string;
  billingAddress: CreateAddress | Address;
  shippingAddress: CreateAddress | Address;
  same_address?: boolean;
  orderItems: OrderItem[];
}

export interface OrderItemResponse {
  order_item_id: number;
  product_name: string;
  quantity: number;
  price: string;
  /** Absent on responses that predate delivery lines; treat a missing value as `PRODUCT`. */
  item_type?: "PRODUCT" | "DELIVERY";
}

import { Address } from "./Address.ts";

export interface UpdateDetailsBody extends Partial<Address> {
  user_id: string;
  address_id: number;
  phone?: string;
}

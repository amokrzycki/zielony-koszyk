import { AddressType } from "@/enums/AddressType.ts";
import { CustomerType } from "@/enums/CustomerType.ts";

export interface CreateAddress {
  first_name: string;
  last_name: string;
  phone: string;
  company_name: string;
  nip: string;
  type: AddressType;
  customer_type: CustomerType;
  default?: boolean;
  is_user_address?: boolean;
  street: string;
  building_number: string;
  flat_number: string;
  city: string;
  zip: string;
}

import { AddressType } from "../enums/AddressType.ts";

export interface Address {
  address_id: number;
  type: AddressType;
  street: string;
  building_number: string;
  flat_number: string;
  city: string;
  zip: string;
}

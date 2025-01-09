import { Roles } from "../enums/Roles.ts";

export interface CreateUserFromAdmin {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  building_number: string;
  flat_number?: string;
  city: string;
  zip: string;
  role: Roles;
}

export interface CreateUser {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  street: string;
  building_number: string;
  flat_number?: string;
  city: string;
  zip: string;
}

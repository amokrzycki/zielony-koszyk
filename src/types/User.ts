import { Roles } from "../enums/Roles.ts";

interface User {
  user_id: string;
  role: Roles;
  email: string;
  first_name: string;
  last_name: string;
  street: string;
  building_number: string;
  city: string;
  zip: string;
  phone: string;
  createdAt: Date;
}

export default User;

import { Roles } from "../enums/Roles.ts";
import { Address } from "./Address.ts";

interface User {
  user_id: string;
  role: Roles;
  email: string;
  first_name: string;
  last_name: string;
  addresses: Address[];
  phone: string;
  created_at: string;
  updated_at: string;
}

export default User;

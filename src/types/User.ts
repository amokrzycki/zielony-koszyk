import type { Roles } from "../enums/Roles.ts";
import type { Address } from "./Address.ts";
import type { MfaMethod } from "../enums/MfaMethod.ts";

interface User {
  user_id: string;
  role: Roles;
  email: string;
  first_name: string;
  last_name: string;
  addresses: Address[];
  phone: string;
  mfa_method: MfaMethod;
  created_at: string;
  updated_at: string;
}

export default User;

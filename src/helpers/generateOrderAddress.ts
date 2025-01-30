import { Address } from "@/types/Address.ts";
import { CreateAddress } from "@/types/CreateAddress.ts";

export const generateOrderAddress = (a: Address | CreateAddress) => {
  return `${a.street} ${a.building_number}${a.flat_number ? `/${a.flat_number}` : ""}, ${a.zip} ${a.city}`;
};

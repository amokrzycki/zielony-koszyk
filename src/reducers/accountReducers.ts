import { PayloadAction } from "@reduxjs/toolkit";
import User from "../types/User.ts";
import { Address } from "../types/Address.ts";
import { CustomerType } from "@/enums/CustomerType.ts";

export interface AccountState {
  token: string | null;
  user: User;
}

export const accountReducers = {
  loginUser(
    state: AccountState,
    action: PayloadAction<{
      accessToken: string;
      user: User;
    }>,
  ) {
    state.token = action.payload.accessToken;
    state.user = action.payload.user;
  },
  updateUserAddresses(state: AccountState, action: PayloadAction<Address>) {
    if (action.payload.customer_type === CustomerType.COMPANY) {
      action.payload.first_name = "";
      action.payload.last_name = "";
    }

    if (action.payload.customer_type === CustomerType.PERSON) {
      action.payload.company_name = "";
      action.payload.nip = "";
    }

    const address = state.user.addresses.find(
      (address) =>
        address.type === action.payload.type &&
        address.address_id !== action.payload.address_id &&
        address.default,
    );

    if (address) {
      address.default = false;
    }

    state.user.addresses = state.user.addresses.map((address) =>
      address.address_id === action.payload.address_id
        ? action.payload
        : address,
    );

    const rememberMe = JSON.parse(
      localStorage.getItem("rememberMe") || "false",
    );

    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  },
  updateUserDetails(state: AccountState, action: PayloadAction<Partial<User>>) {
    state.user = { ...state.user, ...action.payload };
  },
  logoutUser(state: AccountState) {
    state.token = null;
    state.user = {} as User;
  },
};

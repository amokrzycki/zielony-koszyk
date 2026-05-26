import type { PayloadAction } from "@reduxjs/toolkit";
import type User from "../types/User.ts";
import type { Address } from "../types/Address.ts";
import { CustomerType } from "@/enums/CustomerType.ts";
import { clearTokenStorage } from "@/helpers/tokenHelpers.ts";

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
  refreshToken(state: AccountState, action: PayloadAction<string>) {
    state.token = action.payload;
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
        address.type === action.payload.type && address.address_id !== action.payload.address_id && address.default,
    );

    if (address && action.payload.default) {
      address.default = false;
    }

    state.user.addresses = state.user.addresses.map((address) =>
      address.address_id === action.payload.address_id ? action.payload : address,
    );

    // User data is now kept only in Redux state (cleared on logout and page refresh)
  },
  updateUserDetails(state: AccountState, action: PayloadAction<Partial<User>>) {
    state.user = { ...state.user, ...action.payload };
  },
  logoutUser(state: AccountState) {
    state.token = null;
    state.user = {} as User;
    clearTokenStorage();
  },
};

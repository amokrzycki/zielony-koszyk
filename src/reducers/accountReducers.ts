import { PayloadAction } from "@reduxjs/toolkit";
import User from "../types/User.ts";
import { Address } from "../types/Address.ts";

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
    state.user.addresses = state.user.addresses.map((address) =>
      address.address_id === action.payload.address_id
        ? action.payload
        : address,
    );
  },
  updateUserDetails(state: AccountState, action: PayloadAction<Partial<User>>) {
    state.user = { ...state.user, ...action.payload };
  },
  logoutUser(state: AccountState) {
    state.token = null;
    state.user = {} as User;
  },
};

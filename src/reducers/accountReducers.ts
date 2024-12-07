import { PayloadAction } from "@reduxjs/toolkit";
import User from "../types/User.ts";

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
    localStorage.setItem("accessToken", action.payload.accessToken);
  },
  logoutUser(state: AccountState) {
    state.token = null;
    state.user = {} as User;
    localStorage.removeItem("accessToken");
  },
};

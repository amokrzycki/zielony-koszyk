import { createSlice } from "@reduxjs/toolkit";
import { accountReducers, type AccountState } from "@/reducers/accountReducers.ts";
import type User from "../../types/User.ts";

const initialState: AccountState = {
  token: null,
  user: {} as User,
};

export const accountSlice = createSlice({
  name: "auth",
  initialState,
  reducers: accountReducers,
});

export const { loginUser, updateUserAddresses, logoutUser, updateUserDetails, refreshToken } = accountSlice.actions;

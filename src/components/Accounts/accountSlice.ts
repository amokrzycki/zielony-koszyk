import { createSlice } from "@reduxjs/toolkit";
import {
  accountReducers,
  AccountState,
} from "../../reducers/accountReducers.ts";
import User from "../../types/User.ts";

const initialState: AccountState = {
  token: localStorage.getItem("accessToken"),
  user: JSON.parse(localStorage.getItem("user") || "{}") as User,
};

export const accountSlice = createSlice({
  name: "auth",
  initialState,
  reducers: accountReducers,
});

export const { loginUser, updateUserData, logoutUser } = accountSlice.actions;

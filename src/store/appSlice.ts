import { Address } from "../types/Address.ts";
import User from "../types/User.ts";
import { createSlice } from "@reduxjs/toolkit";
import { appReducers } from "../reducers/appReducers.ts";

export interface AppState {
  addressToEdit: Address | null;
  userToEdit: User | null;
}

const initialState: AppState = {
  addressToEdit: null,
  userToEdit: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: appReducers,
});

export const {
  setAddressToEdit,
  clearAddressToEdit,
  setUserToEdit,
  clearUserToEdit,
} = appSlice.actions;

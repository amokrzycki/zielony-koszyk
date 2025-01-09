import { PayloadAction } from "@reduxjs/toolkit";
import { Address } from "../types/Address.ts";
import { AppState } from "../store/appSlice.ts";
import User from "../types/User.ts";

export const appReducers = {
  setAddressToEdit(state: AppState, action: PayloadAction<Address>) {
    state.addressToEdit = action.payload;
  },
  clearAddressToEdit(state: AppState) {
    state.addressToEdit = null;
  },
  setUserToEdit: (state: AppState, action: PayloadAction<User>) => {
    state.userToEdit = action.payload;
  },
  clearUserToEdit: (state: AppState) => {
    state.userToEdit = null;
  },
};

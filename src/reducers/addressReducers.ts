import { AddressState } from "../components/Accounts/Address/addressSlice.ts";
import { PayloadAction } from "@reduxjs/toolkit";
import { Address } from "../types/Address.ts";

export const addressReducers = {
  setAddressToEdit(state: AddressState, action: PayloadAction<Address>) {
    state.addressToEdit = action.payload;
  },
  clearAddressToEdit(state: AddressState) {
    state.addressToEdit = null;
  },
};

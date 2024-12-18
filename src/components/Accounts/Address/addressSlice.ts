import { Address } from "../../../types/Address.ts";
import { createSlice } from "@reduxjs/toolkit";
import { addressReducers } from "../../../reducers/addressReducers.ts";

export interface AddressState {
  addressToEdit: Address | null;
}

const initialState: AddressState = {
  addressToEdit: null,
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: addressReducers,
});

export const { setAddressToEdit, clearAddressToEdit } = addressSlice.actions;

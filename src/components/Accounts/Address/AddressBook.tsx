import { useAppDispatch, useAppSelector } from "../../../hooks/hooks.ts";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "../../../types/User.ts";
import { AddressType } from "../../../enums/AddressType.ts";
import { setAddressToEdit } from "./addressSlice.ts";
import { Address } from "../../../types/Address.ts";

function AddressBook() {
  const user: User = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEditData = (address: Address) => {
    navigate("/konto/ksiazka-adresowa/edytuj-dane");
    dispatch(setAddressToEdit(address));
  };

  const billingAddress = user.addresses.find(
    (address) => address.type === AddressType.BILLING,
  );

  const shippingAddress = user.addresses.find(
    (address) => address.type === AddressType.DELIVERY,
  );

  return (
    <Box className={"flex flex-col items-center"}>
      <Typography variant={"h4"} gutterBottom>
        Dane do rachunku
      </Typography>
      <Box className={"mb-4 p-8 border border-gray-300 rounded-md max-w-md"}>
        <Typography variant={"h5"} gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography>Telefon: {user.phone}</Typography>
        <Typography>
          {billingAddress?.street} {billingAddress?.building_number}
          {billingAddress?.flat_number ? `/${billingAddress?.flat_number}` : ""}
        </Typography>
        <Typography>
          {billingAddress?.zip}, {billingAddress?.city}
        </Typography>
        <Button
          onClick={() => {
            if (billingAddress) {
              handleEditData(billingAddress);
            }
          }}
          variant={"contained"}
          sx={{
            mt: 1,
          }}
        >
          Edytuj dane
        </Button>
      </Box>
      <Typography variant={"h4"} gutterBottom>
        Adres dostawy
      </Typography>
      <Box className={"mb-4 p-8 border border-gray-300 rounded-md max-w-md"}>
        <Typography variant={"h5"} gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography>
          {shippingAddress?.street} {shippingAddress?.building_number}
          {shippingAddress?.flat_number
            ? `/${shippingAddress?.flat_number}`
            : ""}
        </Typography>
        <Typography>
          {shippingAddress?.zip}, {shippingAddress?.city}
        </Typography>
        <Button
          onClick={() => {
            if (shippingAddress) {
              handleEditData(shippingAddress);
            }
          }}
          variant={"contained"}
          sx={{
            mt: 1,
          }}
        >
          Edytuj dane
        </Button>
      </Box>
    </Box>
  );
}

export default AddressBook;

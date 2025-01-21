import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "@/types/User.ts";
import { Address } from "@/types/Address.ts";
import { setAddressToEdit } from "@/store/appSlice.ts";
import { AddressType } from "@/enums/AddressType.ts";
import AddressBox from "@/components/Accounts/Address/AddressBox.tsx";
import DefaultCheckbox from "@/components/Accounts/Address/DefaultCheckbox.tsx";
import { useGetAddressesQuery } from "@/components/Accounts/accountsApiSlice.ts";
import { useEffect } from "react";
import { updateUserDetails } from "@/components/Accounts/accountSlice.ts";

function AddressBook() {
  const user: User = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data } = useGetAddressesQuery(user.user_id);

  useEffect(() => {
    if (data && data !== user.addresses) {
      const updatedDetails: User = {
        ...user,
        addresses: data,
      };
      dispatch(updateUserDetails(updatedDetails));
    }
  }, [data]);

  const handleEditData = (address: Address) => {
    navigate("/konto/ksiazka-adresowa/edytuj-dane");
    dispatch(setAddressToEdit(address));
  };

  const billingAddresses = user.addresses.filter(
    (address) => address.type === AddressType.BILLING,
  );

  const deliveryAddresses = user.addresses.filter(
    (address) => address.type === AddressType.DELIVERY,
  );

  return (
    <Box className={"flex flex-col"}>
      <Typography variant={"h3"} gutterBottom>
        Książka adresowa
      </Typography>
      <Box className={"text-left"}>
        <Button
          onClick={() => {
            navigate("/konto/ksiazka-adresowa/dodaj-adres");
          }}
          variant={"contained"}
          sx={{
            mb: 2,
          }}
        >
          Dodaj nowy adres
        </Button>
        <Typography variant={"h4"} gutterBottom>
          Dane do rachunku
        </Typography>
        <Box className={"flex gap-4"}>
          {billingAddresses.map((address) => (
            <AddressBox
              key={address.address_id}
              address={address}
              onEdit={handleEditData}
              checkBox={
                <DefaultCheckbox address={address} userId={user.user_id} />
              }
            />
          ))}
        </Box>
      </Box>
      <Box className={"text-left"}>
        <Typography variant={"h4"} gutterBottom>
          Adresy dostawy
        </Typography>
        <Box className={"flex gap-4"}>
          {deliveryAddresses.map((address) => (
            <AddressBox
              key={address.address_id}
              address={address}
              onEdit={handleEditData}
              checkBox={
                <DefaultCheckbox address={address} userId={user.user_id} />
              }
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default AddressBook;

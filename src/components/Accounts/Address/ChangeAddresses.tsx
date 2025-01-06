import { useAppDispatch, useAppSelector } from "../../../hooks/hooks.ts";
import { useForm } from "@mantine/form";
import {
  validateBuildingNumber,
  validateCity,
  validateNumber,
  validateStreet,
  validateZip,
} from "../../../utils/validators.ts";
import { Box, Button, TextField } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import User from "../../../types/User.ts";
import { Address } from "../../../types/Address.ts";
import { RootState } from "../../../store/store.ts";
import { UpdateDetailsBody } from "../../../types/updateDetailsBody.ts";
import { AddressType } from "../../../enums/AddressType.ts";
import { updateUserAddresses, updateUserDetails } from "../accountSlice.ts";
import { clearAddressToEdit } from "../../../store/appSlice.ts";
import { useChangeUserAddressMutation } from "../accountsApiSlice.ts";

interface IChangeAddressesFormValues {
  street: string;
  building_number: string;
  flat_number: string;
  city: string;
  zip: string;
  phone: string;
}

function ChangeAddresses() {
  const user: User = useAppSelector((state) => state.auth.user);
  const userAddress: Address = useAppSelector(
    (state: RootState) => state.app.addressToEdit,
  );
  const navigate = useNavigate();
  const [changeDetails] = useChangeUserAddressMutation();
  const dispatch = useAppDispatch();

  const validate = {
    street: validateStreet,
    building_number: validateBuildingNumber,
    flat_number: undefined,
    city: validateCity,
    zip: validateZip,
    phone: validateNumber,
  };

  const form = useForm<IChangeAddressesFormValues>({
    initialValues: {
      street: userAddress?.street,
      building_number: userAddress?.building_number,
      flat_number: userAddress?.flat_number,
      city: userAddress?.city,
      zip: userAddress?.zip,
      phone: user?.phone,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IChangeAddressesFormValues) => {
    const updatedDetails: UpdateDetailsBody = {
      user_id: user.user_id,
      address_id: userAddress.address_id,
      type: userAddress.type,
      ...values,
    };

    const updatedAddress: Address = {
      ...userAddress,
      street: values.street,
      building_number: values.building_number,
      flat_number: values.flat_number,
      city: values.city,
      zip: values.zip,
    };

    toast
      .promise(changeDetails(updatedDetails).unwrap(), {
        loading: "Zapisywanie zmian...",
        success: "Zmiany zostały zapisane",
        error: "Wystąpił błąd podczas zapisywania zmian",
      })
      .then(() => {
        dispatch(updateUserAddresses(updatedAddress));
        dispatch(updateUserDetails({ phone: values.phone }));
        dispatch(clearAddressToEdit());
        navigate("/konto/ksiazka-adresowa");
      });
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}
    >
      <Box className={"flex flex-col justify-center items-center mt-2"}>
        {userAddress?.type === AddressType.BILLING && (
          <TextField
            variant={"outlined"}
            label={"Numer telefonu"}
            {...form.getInputProps("phone")}
            error={Boolean(form.errors.phone) && form.isTouched("phone")}
            helperText={form.errors.phone}
            sx={{ width: "300px", mb: "1em" }}
          />
        )}
        <Box className={"mb-1"}>
          <TextField
            variant="outlined"
            label="Ulica"
            placeholder={"ul. Przykładowa"}
            {...form.getInputProps("street")}
            helperText={form.errors.street}
            error={Boolean(form.errors.street) && form.isTouched("street")}
            sx={{ marginRight: "1em" }}
          />
          <TextField
            variant="outlined"
            label="Numer domu/budynku"
            placeholder={"1A"}
            {...form.getInputProps("building_number")}
            helperText={form.errors.building_number}
            error={
              Boolean(form.errors.building_number) &&
              form.isTouched("building_number")
            }
          />
          <TextField
            variant="outlined"
            label="Numer mieszkania"
            placeholder={"14"}
            {...form.getInputProps("flat_number")}
            helperText={form.errors.flat_number}
            error={
              Boolean(form.errors.flat_number) && form.isTouched("flat_number")
            }
          />
        </Box>
        <Box>
          <TextField
            variant="outlined"
            label="Kod pocztowy"
            placeholder={"00-000"}
            {...form.getInputProps("zip")}
            helperText={form.errors.zip}
            error={Boolean(form.errors.zip) && form.isTouched("zip")}
            sx={{ marginRight: "1em" }}
          />
          <TextField
            variant="outlined"
            label="Miejscowość"
            placeholder={"Warszawa"}
            {...form.getInputProps("city")}
            helperText={form.errors.city}
            error={Boolean(form.errors.city) && form.isTouched("city")}
          />
        </Box>
        <Button
          type={"submit"}
          variant={"contained"}
          sx={{ mt: "1em" }}
          disabled={!isValid && form.isTouched()}
        >
          Zapisz zmiany
        </Button>
      </Box>
    </form>
  );
}

export default ChangeAddresses;

import User from "../../../types/User.ts";
import { useForm } from "@mantine/form";
import { Box, Button, TextField } from "@mui/material";
import { Address } from "../../../types/Address.ts";
import {
  validateBuildingNumber,
  validateCity,
  validateStreet,
  validateZip,
} from "../../../helpers/validators.ts";
import { useChangeUserAddressMutation } from "../../Accounts/accountsApiSlice.ts";
import toast from "react-hot-toast";
import { setUserToEdit } from "../../../store/appSlice.ts";
import { useAppDispatch } from "../../../hooks/hooks.ts";
import { UpdateDetailsBody } from "../../../types/updateDetailsBody.ts";

interface IChangeUserAddressFormValues {
  street: string;
  building_number: string;
  flat_number: string;
  city: string;
  zip: string;
}

interface ChangeUserAddressProps {
  user: User;
  address: Address;
}

function ChangeUserAddress({ address, user }: ChangeUserAddressProps) {
  const [changeDetails] = useChangeUserAddressMutation();
  const dispatch = useAppDispatch();

  const validate = {
    street: validateStreet,
    building_number: validateBuildingNumber,
    city: validateCity,
    zip: validateZip,
  };

  const form = useForm<IChangeUserAddressFormValues>({
    initialValues: {
      street: address.street,
      building_number: address.building_number,
      flat_number: address.flat_number,
      city: address.city,
      zip: address.zip,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IChangeUserAddressFormValues) => {
    const updatedDetails: UpdateDetailsBody = {
      user_id: user.user_id,
      address_id: address.address_id,
      type: address.type,
      ...values,
    };

    const updatedUser: User = {
      ...user,
      addresses: user.addresses.map((userAddress) =>
        userAddress.address_id === address.address_id
          ? { ...userAddress, ...values }
          : userAddress,
      ),
    };

    toast
      .promise(changeDetails(updatedDetails).unwrap(), {
        loading: "Zapisywanie zmian...",
        success: "Zmiany zostały zapisane",
        error: "Wystąpił błąd podczas zapisywania zmian",
      })
      .then(() => {
        dispatch(setUserToEdit(updatedUser));
      });
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Box className={"flex flex-col justify-center items-center mt-2"}>
        <TextField
          variant="outlined"
          label="Ulica"
          required
          placeholder={"ul. Przykładowa"}
          {...form.getInputProps("street")}
          helperText={form.errors.street}
          error={Boolean(form.errors.street) && form.isTouched("street")}
          sx={{ mb: "1em", width: "300px" }}
        />
        <Box className={"flex justify-center items-center mb-4"}>
          <TextField
            variant="outlined"
            label="Numer domu/budynku"
            placeholder={"1A"}
            required
            {...form.getInputProps("building_number")}
            helperText={form.errors.building_number}
            error={
              Boolean(form.errors.building_number) &&
              form.isTouched("building_number")
            }
            sx={{ marginRight: "1em" }}
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
            required
            {...form.getInputProps("zip")}
            helperText={form.errors.zip}
            error={Boolean(form.errors.zip) && form.isTouched("zip")}
            sx={{ marginRight: "1em" }}
          />
          <TextField
            variant="outlined"
            label="Miejscowość"
            required
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

export default ChangeUserAddress;

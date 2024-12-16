import { useAppDispatch, useAppSelector } from "../../hooks/hooks.ts";
import { useForm } from "@mantine/form";
import {
  validateBuildingNumber,
  validateCity,
  validateNumber,
  validateStreet,
  validateZip,
} from "../../utils/validators.ts";
import { Box, Button, TextField } from "@mui/material";
import { useChangeUserDataMutation } from "./accountsApiSlice.ts";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { updateUserData } from "./accountSlice.ts";

interface IChangeAddressesFormValues {
  street: string;
  building_number: string;
  city: string;
  zip: string;
  phone: string;
}

function ChangeAddresses() {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [changeData] = useChangeUserDataMutation();
  const dispatch = useAppDispatch();

  const validate = {
    street: validateStreet,
    building_number: validateBuildingNumber,
    city: validateCity,
    zip: validateZip,
    phone: validateNumber,
  };

  const form = useForm<IChangeAddressesFormValues>({
    initialValues: {
      street: user.street,
      building_number: user.building_number,
      city: user.city,
      zip: user.zip,
      phone: user.phone,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IChangeAddressesFormValues) => {
    const data = {
      ...values,
      user_id: user.user_id,
    };

    toast
      .promise(changeData(data).unwrap(), {
        loading: "Zapisywanie zmian...",
        success: "Zmiany zostały zapisane",
        error: "Wystąpił błąd podczas zapisywania zmian",
      })
      .then(() => {
        dispatch(updateUserData(data));
        navigate("/konto/ksiazka-adresowa");
      });
  };

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          variant={"outlined"}
          label={"Numer telefonu"}
          {...form.getInputProps("phone")}
          error={Boolean(form.errors.phone) && form.isTouched("phone")}
          helperText={form.errors.phone}
          sx={{ width: "300px", mb: "1em" }}
        />
        <Box
          sx={{
            mb: "1em",
          }}
        >
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
            label="Numer domu/lokalu"
            placeholder={"1A/2"}
            {...form.getInputProps("building_number")}
            helperText={form.errors.building_number}
            error={
              Boolean(form.errors.building_number) &&
              form.isTouched("building_number")
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

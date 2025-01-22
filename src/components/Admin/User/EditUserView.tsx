import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import User from "../../../types/User.ts";
import { useForm } from "@mantine/form";
import { Roles } from "@/enums/Roles.ts";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ChangeUserAddress from "./ChangeUserAddress.tsx";
import { AddressType } from "@/enums/AddressType.ts";
import ErrorView from "../../common/ErrorView.tsx";
import { useChangeUserDetailsMutation } from "../../Accounts/accountsApiSlice.ts";
import toast from "react-hot-toast";
import { setUserToEdit } from "@/store/appSlice.ts";
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validateNumber,
} from "@/helpers/validators.ts";

export interface IEditUserFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: Roles;
}

function EditUserView() {
  const user: User = useAppSelector((state) => state.app.userToEdit);
  const [changeDetails] = useChangeUserDetailsMutation();
  const dispatch = useAppDispatch();

  const validate = {
    first_name: validateFirstName,
    last_name: validateLastName,
    email: validateEmail,
    phone: validateNumber,
  };

  const form = useForm<IEditUserFormValues>({
    initialValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      phone: user?.phone,
      role: user?.role,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  if (!user) {
    return (
      <ErrorView
        message={"Nie znaleziono użytkownika."}
        errorText={"Spróbuj ponownie"}
      />
    );
  }

  const billingAddress = user.addresses.find(
    (address) => address.type === AddressType.BILLING,
  );

  const shippingAddress = user.addresses.find(
    (address) => address.type === AddressType.DELIVERY,
  );

  if (!billingAddress || !shippingAddress) {
    return (
      <ErrorView
        message={"Nie znaleziono adresów użytkownika."}
        errorText={"Spróbuj ponownie"}
      />
    );
  }

  const isValid = form.isValid();

  const handleSubmit = (values: IEditUserFormValues) => {
    const updatedUser: User = {
      ...user,
      ...values,
    };

    toast
      .promise(changeDetails(updatedUser).unwrap(), {
        loading: "Aktualizowanie danych...",
        success: "Dane zaktualizowane.",
        error: "Nie udało się zaktualizować danych.",
      })
      .then(() => {
        dispatch(setUserToEdit(updatedUser));
      });
  };

  return (
    <Box className={"flex gap-4 w-full justify-evenly"}>
      <form
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values);
        })}
      >
        <Box className={"flex flex-col justify-center items-center"}>
          <Typography variant={"h6"} gutterBottom>
            Edytuj dane użytkownika
          </Typography>
          <TextField
            variant="outlined"
            label="Imię"
            required
            placeholder={"Jan"}
            {...form.getInputProps("first_name")}
            error={
              Boolean(form.errors.first_name) && form.isTouched("first_name")
            }
            helperText={form.errors.first_name}
            sx={{ m: "1em 0" }}
          />
          <TextField
            variant="outlined"
            label="Nazwisko"
            required
            placeholder={"Kowalski"}
            {...form.getInputProps("last_name")}
            error={
              Boolean(form.errors.last_name) && form.isTouched("last_name")
            }
            helperText={form.errors.last_name}
          />
          <TextField
            variant={"outlined"}
            label={"Email"}
            required
            {...form.getInputProps("email")}
            error={Boolean(form.errors.email) && form.isTouched("email")}
            helperText={form.errors.email}
            sx={{ m: "1em 0", width: "300px" }}
          />
          <TextField
            variant={"outlined"}
            label={"Numer telefonu"}
            required
            {...form.getInputProps("phone")}
            error={Boolean(form.errors.phone) && form.isTouched("phone")}
            helperText={form.errors.phone}
            sx={{ width: "300px" }}
          />
          <FormControl
            variant={"outlined"}
            margin={"normal"}
            fullWidth
            required
            error={Boolean(form.errors.role) && form.isTouched("role")}
          >
            <InputLabel id="role-label">Rola</InputLabel>
            <Select
              labelId={"role-label"}
              label={"Rola"}
              value={form.values.role}
              onChange={(e) =>
                form.setFieldValue("role", e.target.value as Roles)
              }
            >
              <MenuItem value={Roles.ADMIN}>Administrator</MenuItem>
              <MenuItem value={Roles.USER}>Użytkownik</MenuItem>
            </Select>
            {Boolean(form.errors.role) && form.isTouched("role") && (
              <FormHelperText>{form.errors.role}</FormHelperText>
            )}
          </FormControl>
          <Button
            type={"submit"}
            variant={"contained"}
            sx={{ mt: "1em" }}
            disabled={!isValid && form.isTouched()}
          >
            Zmień dane
          </Button>
        </Box>
      </form>
      <Box className={"flex flex-col items-center h-full"}>
        <Typography variant={"h6"} gutterBottom>
          Edytuj adres dostawy
        </Typography>
        <ChangeUserAddress user={user} address={shippingAddress} />
      </Box>
      <Box className={"flex flex-col items-center"}>
        <Typography variant={"h6"} gutterBottom>
          Edytuj adres rozliczeniowy
        </Typography>
        <ChangeUserAddress user={user} address={billingAddress} />
      </Box>
    </Box>
  );
}

export default EditUserView;

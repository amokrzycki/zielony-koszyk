import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {
  validateBuildingNumber,
  validateCity,
  validateEmail,
  validateFirstName,
  validateLastName,
  validateNumber,
  validatePasswordConfirmation,
  validateRegisterPassword,
  validateStreet,
  validateTermsAccepted,
  validateZip,
} from "@/helpers/validators.ts";
import type { CreateUser } from "@/types/CreateUser.ts";
import { useRegisterMutation } from "./accountsApiSlice.ts";
import toast from "react-hot-toast";
import type { Dispatch, SetStateAction } from "react";
import { ctaButtonSx } from "@/components/listingStyles.ts";

export interface IRegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  street: string;
  buildingNumber: string;
  flatNumber: string;
  city: string;
  zip: string;
  termsAccepted: boolean;
}

interface RegisterFormProps {
  setTab: Dispatch<SetStateAction<number>>;
}

function RegisterForm({ setTab }: RegisterFormProps) {
  const [register] = useRegisterMutation();

  const validate = {
    firstName: validateFirstName,
    lastName: validateLastName,
    email: validateEmail,
    phone: validateNumber,
    password: validateRegisterPassword,
    passwordConfirmation: validatePasswordConfirmation,
    street: validateStreet,
    buildingNumber: validateBuildingNumber,
    flatNumber: undefined,
    city: validateCity,
    zip: validateZip,
    termsAccepted: validateTermsAccepted,
  };

  const form = useForm<IRegisterFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
      street: "",
      buildingNumber: "",
      flatNumber: "",
      city: "",
      zip: "",
      termsAccepted: false,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IRegisterFormValues) => {
    const registerData: CreateUser = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      street: values.street,
      building_number: values.buildingNumber,
      flat_number: values.flatNumber,
      city: values.city,
      zip: values.zip,
    };
    toast
      .promise(register(registerData).unwrap(), {
        loading: "Tworzenie konta...",
        success: "Konto zostało utworzone",
        error: "Nie udało się utworzyć konta",
      })
      .then(() => {
        setTab(0);
      });
  };

  return (
    <form
      noValidate
      style={{ width: "100%" }}
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          width: "100%",
          textAlign: "left",
        }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Imię"
          required
          placeholder={"Jan"}
          {...form.getInputProps("firstName")}
          slotProps={{ htmlInput: { autoComplete: "given-name" } }}
          error={Boolean(form.errors.firstName)}
          helperText={form.errors.firstName}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Nazwisko"
          required
          placeholder={"Kowalski"}
          {...form.getInputProps("lastName")}
          slotProps={{ htmlInput: { autoComplete: "family-name" } }}
          error={Boolean(form.errors.lastName)}
          helperText={form.errors.lastName}
        />
        <TextField
          fullWidth
          variant={"outlined"}
          label={"Email"}
          {...form.getInputProps("email")}
          slotProps={{ htmlInput: { autoComplete: "email" } }}
          required
          error={Boolean(form.errors.email)}
          helperText={form.errors.email}
        />
        <TextField
          fullWidth
          variant={"outlined"}
          label={"Numer telefonu"}
          placeholder={"+48123456789"}
          required
          {...form.getInputProps("phone")}
          slotProps={{ htmlInput: { autoComplete: "tel", inputMode: "tel" } }}
          error={Boolean(form.errors.phone)}
          helperText={form.errors.phone}
        />
        <TextField
          fullWidth
          variant={"outlined"}
          label={"Hasło"}
          type={"password"}
          required
          {...form.getInputProps("password")}
          slotProps={{ htmlInput: { autoComplete: "new-password" } }}
          error={Boolean(form.errors.password)}
          helperText={form.errors.password}
        />
        <TextField
          fullWidth
          variant={"outlined"}
          label={"Potwierdź hasło"}
          type={"password"}
          required
          {...form.getInputProps("passwordConfirmation")}
          slotProps={{ htmlInput: { autoComplete: "new-password" } }}
          error={Boolean(form.errors.passwordConfirmation)}
          helperText={form.errors.passwordConfirmation}
        />
        <Typography sx={{ gridColumn: "1 / -1", mt: 1, fontWeight: 700, fontSize: "0.95rem" }}>Adres</Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Ulica"
          required
          placeholder={"ul. Przykładowa"}
          {...form.getInputProps("street")}
          helperText={form.errors.street}
          error={Boolean(form.errors.street)}
          sx={{ gridColumn: "1 / -1" }}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Numer domu/budynku"
          placeholder={"1A"}
          required
          {...form.getInputProps("buildingNumber")}
          helperText={form.errors.buildingNumber}
          error={Boolean(form.errors.buildingNumber)}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Numer mieszkania"
          placeholder={"150"}
          {...form.getInputProps("flatNumber")}
          helperText={form.errors.flatNumber}
          error={Boolean(form.errors.flatNumber)}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Kod pocztowy"
          placeholder={"00-000"}
          required
          {...form.getInputProps("zip")}
          helperText={form.errors.zip}
          error={Boolean(form.errors.zip)}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Miejscowość"
          placeholder={"Warszawa"}
          required
          {...form.getInputProps("city")}
          helperText={form.errors.city}
          error={Boolean(form.errors.city)}
        />
        <FormControl
          required
          error={Boolean(form.errors.termsAccepted)}
          component="fieldset"
          variant={"standard"}
          sx={{ gridColumn: "1 / -1", m: 0 }}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox {...form.getInputProps("termsAccepted", { type: "checkbox" })} />}
              label={"Akceptuję regulamin*"}
            />
          </FormGroup>
          <FormHelperText sx={{ m: 0 }}>{form.errors.termsAccepted}</FormHelperText>
        </FormControl>
        <Button
          type={"submit"}
          variant={"contained"}
          fullWidth
          sx={{ ...ctaButtonSx, gridColumn: "1 / -1", mt: 1, minWidth: 200 }}
          disabled={!isValid && form.isTouched()}>
          Utwórz konto
        </Button>
      </Box>
    </form>
  );
}

export default RegisterForm;

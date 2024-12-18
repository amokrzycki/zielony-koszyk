import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
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
} from "../../utils/validators.ts";
import { CreateUser } from "../../types/CreateUser.ts";
import { useRegisterMutation } from "./accountsApiSlice.ts";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";

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
        <Box>
          <TextField
            variant="outlined"
            label="Imię"
            placeholder={"Jan"}
            {...form.getInputProps("firstName")}
            error={
              Boolean(form.errors.firstName) && form.isTouched("firstName")
            }
            helperText={form.errors.firstName}
            sx={{ marginRight: "1em" }}
          />
          <TextField
            variant="outlined"
            label="Nazwisko"
            placeholder={"Kowalski"}
            {...form.getInputProps("lastName")}
            error={Boolean(form.errors.lastName) && form.isTouched("lastName")}
            helperText={form.errors.lastName}
          />
        </Box>
        <TextField
          variant={"outlined"}
          label={"Email"}
          {...form.getInputProps("email")}
          error={Boolean(form.errors.email) && form.isTouched("email")}
          helperText={form.errors.email}
          sx={{ m: "1em 0", width: "300px" }}
        />
        <TextField
          variant={"outlined"}
          label={"Numer telefonu"}
          {...form.getInputProps("phone")}
          error={Boolean(form.errors.phone) && form.isTouched("phone")}
          helperText={form.errors.phone}
          sx={{ width: "300px" }}
        />
        <TextField
          variant={"outlined"}
          label={"Hasło"}
          type={"password"}
          {...form.getInputProps("password")}
          error={Boolean(form.errors.password) && form.isTouched("password")}
          helperText={form.errors.password}
          sx={{ mt: "1em", width: "300px" }}
        />
        <TextField
          variant={"outlined"}
          label={"Potwierdź hasło"}
          type={"password"}
          {...form.getInputProps("passwordConfirmation")}
          error={
            Boolean(form.errors.passwordConfirmation) &&
            form.isTouched("passwordConfirmation")
          }
          helperText={form.errors.passwordConfirmation}
          sx={{ m: "1em 0", width: "300px" }}
        />
        <Box>
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
            {...form.getInputProps("buildingNumber")}
            helperText={form.errors.buldingNumber}
            error={
              Boolean(form.errors.buildingNumber) &&
              form.isTouched("buildingNumber")
            }
          />
          <TextField
            variant="outlined"
            label="Numer mieszkania"
            placeholder={"150"}
            {...form.getInputProps("flatNumber")}
            helperText={form.errors.flatNumber}
            error={
              Boolean(form.errors.flatNumber) && form.isTouched("flatNumber")
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
        <FormControl
          required
          error={
            Boolean(form.errors.termsAccepted) &&
            form.isTouched("termsAccepted")
          }
          component="fieldset"
          variant={"standard"}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox {...form.getInputProps("termsAccepted")} />}
              label={"Akceptuję regulamin"}
            />
          </FormGroup>
          <FormHelperText sx={{ m: 0 }}>
            {form.errors.termsAccepted}
          </FormHelperText>
        </FormControl>
        <Button
          type={"submit"}
          variant={"contained"}
          sx={{ mt: "1em" }}
          disabled={!isValid && form.isTouched()}
        >
          Utwórz konto
        </Button>
      </Box>
    </form>
  );
}

export default RegisterForm;

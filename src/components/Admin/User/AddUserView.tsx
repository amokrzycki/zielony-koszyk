import { useCreateUserFromAdminMutation } from "../../Accounts/accountsApiSlice.ts";
import {
  validateEmail,
  validateFirstName,
  validateLastName,
  validateNumber,
} from "../../../utils/validators.ts";
import { useForm } from "@mantine/form";
import toast from "react-hot-toast";
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
import { CreateUserFromAdmin } from "../../../types/CreateUserFromAdmin.ts";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../../enums/Roles.ts";

export interface ICreateUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  buildingNumber: string;
  flatNumber: string;
  city: string;
  zip: string;
  role: Roles;
}

function AddUserView() {
  const [createUser] = useCreateUserFromAdminMutation();
  const navigate = useNavigate();

  const validate = {
    firstName: validateFirstName,
    lastName: validateLastName,
    email: validateEmail,
    phone: validateNumber,
  };

  const form = useForm<ICreateUserFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "placeholder",
      buildingNumber: "1",
      flatNumber: "",
      city: "placeholder",
      zip: "00-000",
      role: Roles.USER,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: ICreateUserFormValues) => {
    const registerData: CreateUserFromAdmin = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      phone: values.phone,
      street: values.street,
      building_number: values.buildingNumber,
      flat_number: values.flatNumber,
      city: values.city,
      zip: values.zip,
      role: values.role,
    };

    toast
      .promise(createUser(registerData).unwrap(), {
        loading: "Tworzenie konta...",
        success: `Konto zostało utworzone dla ${values.email}.`,
        error: "Nie udało się utworzyć konta",
      })
      .then(() => {
        navigate("admin/zarzadzanie-klientami");
      });
  };
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}
    >
      <Box className={"flex flex-col justify-center items-center"}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dodaj użytkownika
        </Typography>
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
        <FormControl
          variant={"outlined"}
          margin={"normal"}
          required
          error={Boolean(form.errors.role) && form.isTouched("role")}
          sx={{ width: "300px" }}
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
          sx={{ width: "300px", mb: "1em" }}
        />
        <Box className={"mb-4"}>
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
            sx={{ marginRight: "1em" }}
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
        <Button
          type={"submit"}
          variant={"contained"}
          sx={{ mt: "1em" }}
          disabled={!isValid && form.isTouched()}
        >
          Utwórz użytkownika
        </Button>
      </Box>
    </form>
  );
}

export default AddUserView;

import { useCreateUserFromAdminMutation } from "../../Accounts/accountsApiSlice.ts";
import {
  validateBuildingNumber,
  validateCity,
  validateEmail,
  validateFirstName,
  validateLastName,
  validateNumber,
  validateStreet,
  validateZip,
} from "@/helpers/validators.ts";
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
import type { CreateUserFromAdmin } from "@/types/CreateUserFromAdmin.ts";
import { useNavigate } from "react-router-dom";
import { Roles } from "@/enums/Roles.ts";
import GroupAddOutlined from "@mui/icons-material/GroupAddOutlined";
import AdminPageHeader from "../AdminPageHeader.tsx";
import { panelSx } from "@/components/listingStyles.ts";
import { adminSubheadingSx } from "../adminStyles.ts";

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

const grid = { display: "grid", gap: 2 } as const;
const twoCol = { ...grid, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } } as const;
const streetGrid = { ...grid, gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr" } } as const;

function AddUserView() {
  const [createUser] = useCreateUserFromAdminMutation();
  const navigate = useNavigate();

  const validate = {
    firstName: validateFirstName,
    lastName: validateLastName,
    email: validateEmail,
    phone: validateNumber,
    street: validateStreet,
    buildingNumber: validateBuildingNumber,
    city: validateCity,
    zip: validateZip,
  };

  const form = useForm<ICreateUserFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      buildingNumber: "",
      flatNumber: "",
      city: "",
      zip: "",
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
        navigate("/admin/zarzadzanie-uzytkownikami");
      });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 760 }}>
      <AdminPageHeader
        icon={<GroupAddOutlined />}
        title="Dodaj użytkownika"
        subtitle="Utwórz konto klienta wraz z domyślnym adresem dostawy."
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Box
          sx={(theme) => ({
            ...panelSx(theme),
            p: { xs: 2.5, sm: 3.5 },
            display: "flex",
            flexDirection: "column",
            gap: 3,
          })}>
          <Box>
            <Typography component="h2" sx={{ ...adminSubheadingSx, mb: 2 }}>
              Dane konta
            </Typography>
            <Box sx={grid}>
              <Box sx={twoCol}>
                <TextField
                  variant="outlined"
                  label="Imię"
                  placeholder="Jan"
                  required
                  {...form.getInputProps("firstName")}
                  error={Boolean(form.errors.firstName) && form.isTouched("firstName")}
                  helperText={form.errors.firstName}
                />
                <TextField
                  variant="outlined"
                  label="Nazwisko"
                  placeholder="Kowalski"
                  required
                  {...form.getInputProps("lastName")}
                  error={Boolean(form.errors.lastName) && form.isTouched("lastName")}
                  helperText={form.errors.lastName}
                />
              </Box>
              <Box sx={twoCol}>
                <TextField
                  variant="outlined"
                  label="E-mail"
                  type="email"
                  required
                  {...form.getInputProps("email")}
                  error={Boolean(form.errors.email) && form.isTouched("email")}
                  helperText={form.errors.email}
                />
                <TextField
                  variant="outlined"
                  label="Numer telefonu"
                  type="tel"
                  required
                  {...form.getInputProps("phone")}
                  error={Boolean(form.errors.phone) && form.isTouched("phone")}
                  helperText={form.errors.phone}
                />
              </Box>
              <FormControl
                variant="outlined"
                required
                sx={{ maxWidth: 300 }}
                error={Boolean(form.errors.role) && form.isTouched("role")}>
                <InputLabel id="role-label">Rola</InputLabel>
                <Select
                  labelId="role-label"
                  label="Rola"
                  value={form.values.role}
                  onChange={(e) => form.setFieldValue("role", e.target.value as Roles)}>
                  <MenuItem value={Roles.ADMIN}>Administrator</MenuItem>
                  <MenuItem value={Roles.USER}>Użytkownik</MenuItem>
                </Select>
                {Boolean(form.errors.role) && form.isTouched("role") && (
                  <FormHelperText>{form.errors.role}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ height: "1px", bgcolor: "divider" }} />

          <Box>
            <Typography component="h2" sx={{ ...adminSubheadingSx, mb: 2 }}>
              Domyślny adres dostawy
            </Typography>
            <Box sx={grid}>
              <Box sx={streetGrid}>
                <TextField
                  variant="outlined"
                  label="Ulica"
                  placeholder="ul. Przykładowa"
                  {...form.getInputProps("street")}
                  helperText={form.errors.street}
                  error={Boolean(form.errors.street) && form.isTouched("street")}
                />
                <TextField
                  variant="outlined"
                  label="Nr budynku"
                  placeholder="1A"
                  {...form.getInputProps("buildingNumber")}
                  helperText={form.errors.buildingNumber}
                  error={Boolean(form.errors.buildingNumber) && form.isTouched("buildingNumber")}
                />
                <TextField
                  variant="outlined"
                  label="Nr mieszkania"
                  placeholder="150"
                  {...form.getInputProps("flatNumber")}
                  helperText={form.errors.flatNumber}
                  error={Boolean(form.errors.flatNumber) && form.isTouched("flatNumber")}
                />
              </Box>
              <Box sx={twoCol}>
                <TextField
                  variant="outlined"
                  label="Kod pocztowy"
                  placeholder="00-000"
                  {...form.getInputProps("zip")}
                  helperText={form.errors.zip}
                  error={Boolean(form.errors.zip) && form.isTouched("zip")}
                />
                <TextField
                  variant="outlined"
                  label="Miejscowość"
                  placeholder="Rzeszów"
                  {...form.getInputProps("city")}
                  helperText={form.errors.city}
                  error={Boolean(form.errors.city) && form.isTouched("city")}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3 }}>
          <Button
            variant="text"
            onClick={() => navigate("/admin/zarzadzanie-uzytkownikami")}
            sx={{ borderRadius: "999px", fontWeight: 700 }}>
            Anuluj
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid && form.isTouched()}
            sx={{ borderRadius: "999px", fontWeight: 700 }}>
            Utwórz użytkownika
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default AddUserView;

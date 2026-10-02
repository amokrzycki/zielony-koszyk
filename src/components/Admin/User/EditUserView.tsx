import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import type User from "../../../types/User.ts";
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
import ChangeAddress from "./ChangeAddress.tsx";
import { AddressType } from "@/enums/AddressType.ts";
import ErrorView from "../../common/ErrorView.tsx";
import { useChangeUserDetailsMutation } from "../../Accounts/accountsApiSlice.ts";
import toast from "react-hot-toast";
import { setUserToEdit } from "@/store/appSlice.ts";
import { validateEmail, validateFirstName, validateLastName, validateNumber } from "@/helpers/validators.ts";
import ManageAccountsOutlined from "@mui/icons-material/ManageAccountsOutlined";
import AdminPageHeader from "../AdminPageHeader.tsx";
import { panelSx } from "@/components/listingStyles.ts";
import { adminSubheadingSx } from "../adminStyles.ts";

export interface IEditUserFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: Roles;
}

const grid = { display: "grid", gap: 2 } as const;
const twoCol = { ...grid, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } } as const;

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
    return <ErrorView message={"Nie znaleziono użytkownika."} errorText={"Spróbuj ponownie"} />;
  }

  const billingAddress = user.addresses.find((address) => address.type === AddressType.BILLING);
  const shippingAddress = user.addresses.find((address) => address.type === AddressType.DELIVERY);

  if (!billingAddress || !shippingAddress) {
    return <ErrorView message={"Nie znaleziono adresów użytkownika."} errorText={"Spróbuj ponownie"} />;
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
    <Box sx={{ width: "100%" }}>
      <AdminPageHeader
        icon={<ManageAccountsOutlined />}
        title={`Edycja: ${user.first_name} ${user.last_name}`}
        subtitle={user.email}
      />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2.5, alignItems: "start" }}>
        <Box
          component="form"
          onSubmit={form.onSubmit(handleSubmit)}
          sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3.5 } })}>
          <Typography component="h2" sx={{ ...adminSubheadingSx, mb: 2.5 }}>
            Dane użytkownika
          </Typography>
          <Box sx={grid}>
            <Box sx={twoCol}>
              <TextField
                variant="outlined"
                label="Imię"
                required
                placeholder="Jan"
                {...form.getInputProps("first_name")}
                error={Boolean(form.errors.first_name) && form.isTouched("first_name")}
                helperText={form.errors.first_name}
              />
              <TextField
                variant="outlined"
                label="Nazwisko"
                required
                placeholder="Kowalski"
                {...form.getInputProps("last_name")}
                error={Boolean(form.errors.last_name) && form.isTouched("last_name")}
                helperText={form.errors.last_name}
              />
            </Box>
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
            <FormControl
              variant="outlined"
              required
              sx={{ maxWidth: 320 }}
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!isValid && form.isTouched()}
              sx={{ borderRadius: "999px", fontWeight: 700 }}>
              Zapisz dane
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3.5 } })}>
            <Typography component="h2" sx={{ ...adminSubheadingSx, mb: 2.5 }}>
              Adres dostawy
            </Typography>
            <ChangeAddress user={user} address={shippingAddress} />
          </Box>
          <Box sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3.5 } })}>
            <Typography component="h2" sx={{ ...adminSubheadingSx, mb: 2.5 }}>
              Adres do faktury
            </Typography>
            <ChangeAddress user={user} address={billingAddress} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default EditUserView;

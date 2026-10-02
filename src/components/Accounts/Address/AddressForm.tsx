import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { useForm } from "@mantine/form";
import {
  validateBuildingNumber,
  validateCity,
  validateCompany,
  validateCompanyNip,
  validateFirstName,
  validateLastName,
  validateNumber,
  validateStreet,
  validateZip,
} from "@/helpers/validators.ts";
import { Box, Button, TextField, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import type { Address } from "@/types/Address.ts";
import type { RootState } from "@/store/store.ts";
import type { UpdateDetailsBody } from "@/types/updateDetailsBody.ts";
import { AddressType } from "@/enums/AddressType.ts";
import { updateUserAddresses, updateUserDetails } from "../accountSlice.ts";
import { clearAddressToEdit } from "@/store/appSlice.ts";
import { useChangeUserAddressMutation, useCreateNewAddressMutation } from "../accountsApiSlice.ts";
import { CustomerType } from "@/enums/CustomerType.ts";
import type User from "@/types/User.ts";
import CustomerTypeRadios from "@/components/common/CustomerTypeRadios.tsx";
import AddressTypeRadios from "@/components/Accounts/Address/AddressTypeRadios.tsx";
import { useState } from "react";
import { ghostButtonSx, ctaButtonSx, panelSx } from "@/components/listingStyles.ts";

export interface IChangeAddressesFormValues {
  first_name: string;
  last_name: string;
  company_name: string;
  nip: string;
  phone: string;
  street: string;
  building_number: string;
  flat_number: string;
  city: string;
  zip: string;
  type: AddressType;
  customer_type: CustomerType;
}

const fieldGrid = { display: "grid", gap: 2 } as const;

function AddressForm() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const userAddress: Address = useAppSelector((state: RootState) => state.app.addressToEdit);
  const [customerType, setCustomerType] = useState<CustomerType>(userAddress?.customer_type || CustomerType.PERSON);
  const navigate = useNavigate();
  const [changeDetails, { isLoading: isSaving }] = useChangeUserAddressMutation();
  const [addAddress, { isLoading: isAdding }] = useCreateNewAddressMutation();
  const dispatch = useAppDispatch();

  const isEdit = Boolean(userAddress);
  const isSubmitting = isSaving || isAdding;

  const validate = {
    first_name: customerType === CustomerType.PERSON ? validateFirstName : undefined,
    last_name: customerType === CustomerType.PERSON ? validateLastName : undefined,
    company_name: customerType === CustomerType.COMPANY ? validateCompany : undefined,
    nip: customerType === CustomerType.COMPANY ? validateCompanyNip : undefined,
    phone: validateNumber,
    street: validateStreet,
    building_number: validateBuildingNumber,
    flat_number: undefined,
    city: validateCity,
    zip: validateZip,
    type: undefined,
    customer_type: undefined,
  };

  const form = useForm<IChangeAddressesFormValues>({
    initialValues: {
      first_name: userAddress?.first_name || "",
      last_name: userAddress?.last_name || "",
      company_name: userAddress?.company_name || "",
      nip: userAddress?.nip || "",
      phone: userAddress?.phone || "",
      street: userAddress?.street || "",
      building_number: userAddress?.building_number || "",
      flat_number: userAddress?.flat_number || "",
      city: userAddress?.city || "",
      zip: userAddress?.zip || "",
      type: userAddress?.type || AddressType.BILLING,
      customer_type: userAddress?.customer_type || CustomerType.PERSON,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IChangeAddressesFormValues) => {
    const updatedDetails: UpdateDetailsBody = {
      user_id: user.user_id,
      address_id: userAddress?.address_id || 1,
      default: userAddress?.default || false,
      ...values,
    };

    const updatedAddress: Address = {
      ...userAddress,
      default: userAddress?.default || false,
      ...values,
    };

    if (!userAddress) {
      toast
        .promise(
          addAddress({
            user_id: user.user_id,
            address: values,
          }).unwrap(),
          {
            loading: "Dodawanie adresu...",
            success: "Adres został dodany",
            error: "Wystąpił błąd podczas dodawania adresu",
          },
        )
        .then(() => {
          navigate("/konto/ksiazka-adresowa", { replace: true });
        });
      return;
    }

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

  const handleCustomerTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    form.setFieldValue("customer_type", type);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", textAlign: "left" }}>
      <Typography
        component="h1"
        sx={{
          m: 0,
          fontSize: { xs: "1.7rem", md: "2.05rem" },
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
        }}>
        {isEdit ? "Edytuj adres" : "Nowy adres"}
      </Typography>
      <Typography sx={{ mt: 1, color: "text.secondary", maxWidth: "54ch", lineHeight: 1.6 }}>
        {isEdit
          ? "Zmień dane adresu. Zapisz, aby zaktualizować go w książce adresowej."
          : "Uzupełnij dane nowego adresu do rachunku lub dostawy."}
      </Typography>

      <Box
        component="form"
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values);
        })}
        sx={(theme) => ({ ...panelSx(theme), mt: { xs: 3, md: 3.5 }, p: { xs: 2, sm: 3 } })}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <CustomerTypeRadios
            customerType={customerType}
            setCustomerType={handleCustomerTypeChange}
            touched={form.isTouched("customer_type")}
          />
          <AddressTypeRadios form={form} />
        </Box>

        <Box sx={{ ...fieldGrid, mt: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {customerType === CustomerType.PERSON ? (
            <>
              <TextField
                fullWidth
                label="Imię"
                required
                placeholder="Jan"
                autoComplete="given-name"
                {...form.getInputProps("first_name")}
                error={Boolean(form.errors.first_name) && form.isTouched("first_name")}
                helperText={form.errors.first_name}
              />
              <TextField
                fullWidth
                label="Nazwisko"
                required
                placeholder="Kowalski"
                autoComplete="family-name"
                {...form.getInputProps("last_name")}
                error={Boolean(form.errors.last_name) && form.isTouched("last_name")}
                helperText={form.errors.last_name}
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Nazwa firmy"
                required
                placeholder="Firma XYZ"
                autoComplete="organization"
                {...form.getInputProps("company_name")}
                error={Boolean(form.errors.company_name) && form.isTouched("company_name")}
                helperText={form.errors.company_name}
              />
              <TextField
                fullWidth
                label="NIP"
                required
                placeholder="1234567890"
                {...form.getInputProps("nip")}
                error={Boolean(form.errors.nip) && form.isTouched("nip")}
                helperText={form.errors.nip}
              />
            </>
          )}
        </Box>

        <TextField
          fullWidth
          label="Numer telefonu"
          required
          type="tel"
          placeholder="+48123456789"
          autoComplete="tel"
          {...form.getInputProps("phone")}
          error={Boolean(form.errors.phone) && form.isTouched("phone")}
          helperText={form.errors.phone}
          sx={{ mt: 2 }}
        />

        <Box sx={{ ...fieldGrid, mt: 2, gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr" } }}>
          <TextField
            fullWidth
            label="Ulica"
            required
            placeholder="ul. Przykładowa"
            autoComplete="address-line1"
            {...form.getInputProps("street")}
            helperText={form.errors.street}
            error={Boolean(form.errors.street) && form.isTouched("street")}
          />
          <TextField
            fullWidth
            label="Nr domu"
            required
            placeholder="1A"
            {...form.getInputProps("building_number")}
            helperText={form.errors.building_number}
            error={Boolean(form.errors.building_number) && form.isTouched("building_number")}
          />
          <TextField
            fullWidth
            label="Nr mieszkania"
            placeholder="14"
            {...form.getInputProps("flat_number")}
            helperText={form.errors.flat_number}
            error={Boolean(form.errors.flat_number) && form.isTouched("flat_number")}
          />
        </Box>

        <Box sx={{ ...fieldGrid, mt: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" } }}>
          <TextField
            fullWidth
            label="Kod pocztowy"
            required
            placeholder="00-000"
            autoComplete="postal-code"
            {...form.getInputProps("zip")}
            helperText={form.errors.zip}
            error={Boolean(form.errors.zip) && form.isTouched("zip")}
          />
          <TextField
            fullWidth
            label="Miejscowość"
            required
            placeholder="Rzeszów"
            autoComplete="address-level2"
            {...form.getInputProps("city")}
            helperText={form.errors.city}
            error={Boolean(form.errors.city) && form.isTouched("city")}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mt: 3.5 }}>
          <Button type="submit" disabled={!isValid || isSubmitting} sx={ctaButtonSx}>
            {isEdit ? "Zapisz zmiany" : "Dodaj adres"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              navigate("/konto/ksiazka-adresowa");
            }}
            sx={(theme) => ghostButtonSx(theme)}>
            Anuluj
          </Button>
        </Box>
        {!isValid && (
          <Typography sx={{ mt: 1.5, color: "text.secondary", fontSize: "0.85rem", lineHeight: 1.5 }}>
            Uzupełnij wymagane pola, aby zapisać adres.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default AddressForm;

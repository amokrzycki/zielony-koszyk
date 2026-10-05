import type User from "../../../types/User.ts";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { useApiError } from "../useAdminI18n.ts";
import { Box, Button, TextField } from "@mui/material";
import type { Address } from "@/types/Address.ts";
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
import { useChangeUserAddressMutation } from "../../Accounts/accountsApiSlice.ts";
import toast from "react-hot-toast";
import { setUserToEdit } from "@/store/appSlice.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import type { UpdateDetailsBody } from "@/types/updateDetailsBody.ts";
import { useState } from "react";
import { CustomerType } from "@/enums/CustomerType.ts";
import CustomerTypeRadios from "@/components/common/CustomerTypeRadios.tsx";

interface IChangeUserAddressFormValues {
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
  customer_type: CustomerType;
}

interface ChangeUserAddressProps {
  user: User;
  address: Address;
}

const grid = { display: "grid", gap: 2 } as const;
const twoCol = { ...grid, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } } as const;
const streetGrid = { ...grid, gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr" } } as const;

function ChangeAddress({ address, user }: ChangeUserAddressProps) {
  const { t } = useTranslation("admin");
  const apiError = useApiError();
  const [changeDetails] = useChangeUserAddressMutation();
  const dispatch = useAppDispatch();

  const [customerType, setCustomerType] = useState<CustomerType>(address?.customer_type || CustomerType.PERSON);

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
    customer_type: undefined,
  };

  const form = useForm<IChangeUserAddressFormValues>({
    initialValues: {
      first_name: address.first_name || "",
      last_name: address.last_name || "",
      company_name: address.company_name || "",
      nip: address.nip || "",
      phone: address.phone,
      street: address.street,
      building_number: address.building_number,
      flat_number: address.flat_number,
      city: address.city,
      zip: address.zip,
      customer_type: address.customer_type,
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
      default: true,
      ...values,
    };

    const updatedUser: User = {
      ...user,
      addresses: user.addresses.map((userAddress) =>
        userAddress.address_id === address.address_id ? { ...userAddress, ...values } : userAddress,
      ),
    };

    toast
      .promise(changeDetails(updatedDetails).unwrap(), {
        loading: t("changeAddress.saving"),
        success: t("changeAddress.saved"),
        error: (error) => apiError(error, t("changeAddress.error")),
      })
      .then(() => {
        dispatch(setUserToEdit(updatedUser));
      });
  };

  const handleCustomerTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    form.setFieldValue("customer_type", type);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Box sx={grid}>
        <CustomerTypeRadios
          customerType={customerType}
          setCustomerType={handleCustomerTypeChange}
          touched={form.isTouched("customer_type")}
        />

        {customerType === CustomerType.PERSON ? (
          <Box sx={twoCol}>
            <TextField
              variant="outlined"
              label={t("userForm.firstName")}
              required
              placeholder={t("userForm.firstNamePlaceholder")}
              {...form.getInputProps("first_name")}
              error={Boolean(form.errors.first_name) && form.isTouched("first_name")}
              helperText={form.errors.first_name}
            />
            <TextField
              variant="outlined"
              label={t("userForm.lastName")}
              required
              placeholder={t("userForm.lastNamePlaceholder")}
              {...form.getInputProps("last_name")}
              error={Boolean(form.errors.last_name) && form.isTouched("last_name")}
              helperText={form.errors.last_name}
            />
          </Box>
        ) : (
          <Box sx={twoCol}>
            <TextField
              variant="outlined"
              label={t("userForm.companyName")}
              required
              placeholder={t("userForm.companyNamePlaceholder")}
              {...form.getInputProps("company_name")}
              error={Boolean(form.errors.company_name) && form.isTouched("company_name")}
              helperText={form.errors.company_name}
            />
            <TextField
              variant="outlined"
              label={t("userForm.nip")}
              required
              placeholder={t("userForm.nipPlaceholder")}
              {...form.getInputProps("nip")}
              error={Boolean(form.errors.nip) && form.isTouched("nip")}
              helperText={form.errors.nip}
            />
          </Box>
        )}

        <TextField
          variant="outlined"
          label={t("userForm.phone")}
          type="tel"
          required
          {...form.getInputProps("phone")}
          helperText={form.errors.phone}
          error={Boolean(form.errors.phone) && form.isTouched("phone")}
        />
        <Box sx={streetGrid}>
          <TextField
            variant="outlined"
            label={t("userForm.street")}
            required
            placeholder={t("userForm.streetPlaceholder")}
            {...form.getInputProps("street")}
            helperText={form.errors.street}
            error={Boolean(form.errors.street) && form.isTouched("street")}
          />
          <TextField
            variant="outlined"
            label={t("userForm.buildingNumber")}
            placeholder={t("userForm.buildingNumberPlaceholder")}
            required
            {...form.getInputProps("building_number")}
            helperText={form.errors.building_number}
            error={Boolean(form.errors.building_number) && form.isTouched("building_number")}
          />
          <TextField
            variant="outlined"
            label={t("userForm.flatNumber")}
            placeholder={t("userForm.flatNumberPlaceholder")}
            {...form.getInputProps("flat_number")}
            helperText={form.errors.flat_number}
            error={Boolean(form.errors.flat_number) && form.isTouched("flat_number")}
          />
        </Box>
        <Box sx={twoCol}>
          <TextField
            variant="outlined"
            label={t("userForm.zip")}
            placeholder={t("userForm.zipPlaceholder")}
            required
            {...form.getInputProps("zip")}
            helperText={form.errors.zip}
            error={Boolean(form.errors.zip) && form.isTouched("zip")}
          />
          <TextField
            variant="outlined"
            label={t("userForm.city")}
            required
            placeholder={t("userForm.cityPlaceholder")}
            {...form.getInputProps("city")}
            helperText={form.errors.city}
            error={Boolean(form.errors.city) && form.isTouched("city")}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid && form.isTouched()}
          sx={{ borderRadius: "999px", fontWeight: 700 }}>
          {t("changeAddress.save")}
        </Button>
      </Box>
    </form>
  );
}

export default ChangeAddress;

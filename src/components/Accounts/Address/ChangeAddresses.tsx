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
import { Address } from "@/types/Address.ts";
import { RootState } from "@/store/store.ts";
import { UpdateDetailsBody } from "@/types/updateDetailsBody.ts";
import { AddressType } from "@/enums/AddressType.ts";
import { updateUserAddresses, updateUserDetails } from "../accountSlice.ts";
import { clearAddressToEdit } from "@/store/appSlice.ts";
import { useChangeUserAddressMutation } from "../accountsApiSlice.ts";
import { CustomerType } from "@/enums/CustomerType.ts";
import User from "@/types/User.ts";
import CustomerTypeRadios from "@/components/common/CustomerTypeRadios.tsx";
import AddressTypeRadios from "@/components/Accounts/Address/AddressTypeRadios.tsx";
import { useState } from "react";

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

function ChangeAddresses() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const userAddress: Address = useAppSelector(
    (state: RootState) => state.app.addressToEdit,
  );
  const [customerType, setCustomerType] = useState<CustomerType>(
    userAddress?.customer_type,
  );
  const navigate = useNavigate();
  const [changeDetails] = useChangeUserAddressMutation();
  const dispatch = useAppDispatch();

  const validate = {
    first_name:
      customerType === CustomerType.PERSON ? validateFirstName : undefined,
    last_name:
      customerType === CustomerType.PERSON ? validateLastName : undefined,
    company_name:
      customerType === CustomerType.COMPANY ? validateCompany : undefined,
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
      phone: userAddress?.phone,
      street: userAddress?.street,
      building_number: userAddress?.building_number,
      flat_number: userAddress?.flat_number,
      city: userAddress?.city,
      zip: userAddress?.zip,
      type: userAddress?.type,
      customer_type: userAddress?.customer_type,
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IChangeAddressesFormValues) => {
    const updatedDetails: UpdateDetailsBody = {
      user_id: user.user_id,
      address_id: userAddress.address_id,
      ...values,
    };

    const updatedAddress: Address = {
      ...userAddress,
      ...values,
    };

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
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}
    >
      <Box className={"flex flex-col items-start mt-2"}>
        <Typography variant={"h5"} gutterBottom>
          Dane adresowe
        </Typography>
        <CustomerTypeRadios
          customerType={customerType}
          setCustomerType={handleCustomerTypeChange}
          touched={form.isTouched("customer_type")}
        />
        <AddressTypeRadios form={form} />
        {customerType === CustomerType.PERSON && (
          <>
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
              sx={{ mb: "1em", mt: "1em" }}
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
              sx={{ mb: "1em" }}
            />
          </>
        )}
        {customerType === CustomerType.COMPANY && (
          <>
            <TextField
              variant="outlined"
              label="Nazwa firmy"
              required
              placeholder={"Firma XYZ"}
              {...form.getInputProps("company_name")}
              error={
                Boolean(form.errors.company_name) &&
                form.isTouched("company_name")
              }
              helperText={form.errors.company_name}
              sx={{ mb: "1em", mt: "1em" }}
            />
            <TextField
              variant="outlined"
              label="NIP"
              required
              placeholder={"1234567890"}
              {...form.getInputProps("nip")}
              error={Boolean(form.errors.nip) && form.isTouched("nip")}
              helperText={form.errors.nip}
              sx={{ mb: "1em" }}
            />
          </>
        )}
        <TextField
          variant={"outlined"}
          label={"Numer telefonu"}
          {...form.getInputProps("phone")}
          error={Boolean(form.errors.phone) && form.isTouched("phone")}
          helperText={form.errors.phone}
          sx={{ width: "300px", mb: "1em" }}
        />
        <TextField
          variant="outlined"
          label="Ulica"
          placeholder={"ul. Przykładowa"}
          {...form.getInputProps("street")}
          helperText={form.errors.street}
          error={Boolean(form.errors.street) && form.isTouched("street")}
          sx={{ mb: "1em" }}
        />
        <TextField
          variant="outlined"
          label="Numer domu/budynku"
          placeholder={"1A"}
          {...form.getInputProps("building_number")}
          helperText={form.errors.building_number}
          error={
            Boolean(form.errors.building_number) &&
            form.isTouched("building_number")
          }
          sx={{ mb: "1em" }}
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
          sx={{ mb: "1em" }}
        />
        <TextField
          variant="outlined"
          label="Kod pocztowy"
          placeholder={"00-000"}
          {...form.getInputProps("zip")}
          helperText={form.errors.zip}
          error={Boolean(form.errors.zip) && form.isTouched("zip")}
          sx={{ mb: "1em" }}
        />
        <TextField
          variant="outlined"
          label="Miejscowość"
          placeholder={"Warszawa"}
          {...form.getInputProps("city")}
          helperText={form.errors.city}
          error={Boolean(form.errors.city) && form.isTouched("city")}
          sx={{ mb: "1em" }}
        />
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

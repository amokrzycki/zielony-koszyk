import { useForm } from "@mantine/form";
import { Box, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store.ts";
import {
  setBillingAddress,
  setOrder,
  setShippingAddress,
} from "./orderSlice.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import {
  validateBuildingNumber,
  validateCity,
  validateCompany,
  validateCompanyNip,
  validateEmail,
  validateFirstName,
  validateLastName,
  validateNumber,
  validateStreet,
  validateZip,
} from "@/helpers/validators.ts";
import User from "../../types/User.ts";
import { AddressType } from "@/enums/AddressType.ts";
import { CustomerType } from "@/enums/CustomerType.ts";
import CustomerTypeRadios from "@/components/common/CustomerTypeRadios.tsx";
import { useState } from "react";
import { Address } from "@/types/Address.ts";
import { CreateOrderDTO } from "@/types/CreateOrderDTO.ts";

export interface IFormValues {
  first_name: string;
  last_name: string;
  company_name: string;
  nip: string;
  customer_type: CustomerType;
  email: string;
  phone: string;
  street: string;
  building_number: string;
  flat_number: string;
  city: string;
  zip: string;
}

interface OrderFormProps {
  address: Address;
}

function OrderForm({ address }: OrderFormProps) {
  const user: User = useSelector((state: RootState) => state.auth.user);
  const orderInfo: CreateOrderDTO = useSelector(
    (state: RootState) => state.order.orderInfo,
  );
  const dispatch = useAppDispatch();

  const [customerType, setCustomerType] = useState<CustomerType>(
    address?.customer_type || CustomerType.PERSON,
  );

  const validate = {
    first_name:
      customerType === CustomerType.PERSON ? validateFirstName : undefined,
    last_name:
      customerType === CustomerType.PERSON ? validateLastName : undefined,
    company_name:
      customerType === CustomerType.COMPANY ? validateCompany : undefined,
    nip: customerType === CustomerType.COMPANY ? validateCompanyNip : undefined,
    email: validateEmail,
    phone: validateNumber,
    street: validateStreet,
    building_number: validateBuildingNumber,
    flat_number: undefined,
    city: validateCity,
    zip: validateZip,
    customer_type: undefined,
  };

  const form = useForm<IFormValues>({
    initialValues: {
      first_name: address?.first_name || "",
      last_name: address?.last_name || "",
      email: user?.email || "",
      phone: address?.phone || "",
      company_name: address?.company_name || "",
      nip: address?.nip || "",
      customer_type: address?.customer_type || CustomerType.PERSON,
      street: address?.street || "",
      building_number: address?.building_number || "",
      flat_number: address?.flat_number || "",
      city: address?.city || "",
      zip: address?.zip || "",
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const handleSubmit = (values: IFormValues) => {
    const type = address?.type || AddressType.DELIVERY;

    const createdAddress: Address = {
      address_id: address?.address_id || 0,
      ...values,
      type,
    };

    dispatch(setOrder({ ...orderInfo, customer_email: values.email }));

    if (type === AddressType.DELIVERY) {
      dispatch(setShippingAddress(createdAddress));
    }

    if (type === AddressType.BILLING) {
      dispatch(setBillingAddress(createdAddress));
    }
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
      <Box className={"flex flex-col gap-4"}>
        <Typography variant="h5">Dane do wysyłki</Typography>
        <CustomerTypeRadios
          customerType={customerType}
          setCustomerType={handleCustomerTypeChange}
          touched={form.isTouched("customer_type")}
        />
        {customerType === CustomerType.PERSON && (
          <Box>
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
              sx={{ mr: "1em" }}
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
          </Box>
        )}
        {customerType === CustomerType.COMPANY && (
          <Box>
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
              sx={{ mr: "1em" }}
            />
            <TextField
              variant="outlined"
              label="NIP"
              required
              placeholder={"1234567890"}
              {...form.getInputProps("nip")}
              error={Boolean(form.errors.nip) && form.isTouched("nip")}
              helperText={form.errors.nip}
            />
          </Box>
        )}
        <TextField
          variant="outlined"
          label="Email"
          placeholder={"twoj.mail@gmail.com"}
          {...form.getInputProps("email")}
          helperText={form.errors.email}
          error={Boolean(form.errors.email) && form.isTouched("email")}
        />
        <TextField
          variant="outlined"
          label="Numer telefonu"
          placeholder={"+48123456789"}
          {...form.getInputProps("phone")}
          helperText={form.errors.phone}
          error={Boolean(form.errors.phone) && form.isTouched("phone")}
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
            {...form.getInputProps("building_number")}
            helperText={form.errors.building_number}
            error={
              Boolean(form.errors.building_number) &&
              form.isTouched("building_number")
            }
            sx={{ mr: "1em" }}
          />
          <TextField
            variant="outlined"
            label="Numer mieszkania"
            placeholder={"150"}
            {...form.getInputProps("flat_number")}
            helperText={form.errors.flat_number}
            error={
              Boolean(form.errors.flat_number) && form.isTouched("flat_number")
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
      </Box>
    </form>
  );
}

export default OrderForm;

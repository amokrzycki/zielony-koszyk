import { useForm } from "@mantine/form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Order } from "@/types/Order.ts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store.ts";
import CartItem from "../../types/CartItem.ts";
import { setOrder } from "./orderSlice.ts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { calculateTotalAmount } from "../Cart/cartSlice.ts";
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
import { OrderType } from "@/enums/OrderType.ts";
import CustomerTypeRadios from "@/components/common/CustomerTypeRadios.tsx";
import { useState } from "react";

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

function OrderForm() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const user: User = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const deliveryAddress = user.addresses?.find(
    (address) => address.type === AddressType.DELIVERY,
  );

  const [customerType, setCustomerType] = useState<CustomerType>(
    deliveryAddress?.customer_type || CustomerType.PERSON,
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
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      company_name: deliveryAddress?.company_name || "",
      nip: deliveryAddress?.nip || "",
      customer_type: deliveryAddress?.customer_type || CustomerType.PERSON,
      street: deliveryAddress?.street || "",
      building_number: deliveryAddress?.building_number || "",
      flat_number: deliveryAddress?.flat_number || "",
      city: deliveryAddress?.city || "",
      zip: deliveryAddress?.zip || "",
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IFormValues) => {
    const order: Order = {
      user_id: user.user_id,
      customer_name:
        values.customer_type === CustomerType.PERSON
          ? `${values.first_name} ${values.last_name}`
          : values.company_name,
      customer_email: values.email,
      customer_phone: values.phone,
      nip:
        values.customer_type === CustomerType.COMPANY ? values.nip : undefined,
      customer_address: `${values.street} ${values.building_number}${values.flat_number ? `/${values.flat_number}` : ``}, ${values.zip} ${values.city}`,
      order_type:
        values.customer_type === CustomerType.PERSON
          ? OrderType.PRIVATE
          : OrderType.COMPANY,
      orderDetails: cart.map((item: CartItem) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    dispatch(setOrder(order));
    dispatch(calculateTotalAmount());
    navigate("/zamowienie/podsumowanie");
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

        <Button type="submit" disabled={!isValid} variant="contained">
          Przejdź dalej
        </Button>
      </Box>
    </form>
  );
}

export default OrderForm;

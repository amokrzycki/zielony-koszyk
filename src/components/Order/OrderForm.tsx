import { useForm } from "@mantine/form";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Order } from "../../types/Order.ts";
import { OrderStatuses } from "../../enums/OrderStatuses.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import CartItem from "../../types/CartItem.ts";
import { setOrder } from "./orderSlice.ts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hooks.ts";
import { calculateTotalAmount } from "../Cart/cartSlice.ts";
import {
  validateBuildingNumber,
  validateCity,
  validateEmail,
  validateFirstName,
  validateLastName,
  validateNumber,
  validateStreet,
  validateZip,
} from "../../helpers/validators.ts";
import User from "../../types/User.ts";
import { AddressType } from "../../enums/AddressType.ts";

interface IFormValues {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  street: string;
  buildingNumber: string;
  flatNumber: string;
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

  const validate = {
    firstName: validateFirstName,
    lastName: validateLastName,
    email: validateEmail,
    number: validateNumber,
    street: validateStreet,
    buildingNumber: validateBuildingNumber,
    flatNumber: undefined,
    city: validateCity,
    zip: validateZip,
  };

  const form = useForm<IFormValues>({
    initialValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      number: user?.phone || "",
      street: deliveryAddress?.street || "",
      buildingNumber: deliveryAddress?.building_number || "",
      flatNumber: deliveryAddress?.flat_number || "",
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
      customer_name: `${values.firstName} ${values.lastName}`,
      customer_email: values.email,
      customer_phone: values.number,
      customer_address: `${values.street} ${values.buildingNumber}${values.flatNumber ? `/${values.flatNumber}` : ``}, ${values.zip} ${values.city}`,
      status: OrderStatuses.NEW,
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

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        handleSubmit(values);
      })}
    >
      <Box className={"flex flex-col gap-4"}>
        <Typography variant="h5">Dane do wysyłki</Typography>
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
          {...form.getInputProps("number")}
          helperText={form.errors.number}
          error={Boolean(form.errors.number) && form.isTouched("number")}
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

        <Button type="submit" disabled={!isValid} variant="contained">
          Przejdź dalej
        </Button>
      </Box>
    </form>
  );
}

export default OrderForm;

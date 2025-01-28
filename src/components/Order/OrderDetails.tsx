import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/hooks/hooks";
import { useNavigate } from "react-router-dom";

import { AddressType } from "@/enums/AddressType";
import { CustomerType } from "@/enums/CustomerType";
import { CreateOrder } from "@/types/CreateOrder.ts";
import CartSummary from "@/components/Cart/CartSummary.tsx";
import ShippingFormFields from "@/components/Order/ShippingFormFields.tsx";
import BillingFormFields from "@/components/Order/BillingFormFields.tsx";
import { setOrder } from "@/components/Order/orderSlice.ts";
import User from "@/types/User.ts";
import { OrderType } from "@/enums/OrderType.ts";
import { CreateAddress } from "@/types/CreateAddress.ts";
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

export interface IFormValues {
  shipping: CreateAddress;
  billing: CreateAddress;
  email: string;
}

function OrderDetails() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const orderInfo: CreateOrder = useSelector(
    (state: RootState) => state.order.orderInfo,
  );

  const user: User = useSelector((state: RootState) => state.auth.user);

  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [shippingType, setShippingType] = useState(
    orderInfo.shippingAddress.customer_type === CustomerType.COMPANY
      ? CustomerType.COMPANY
      : CustomerType.PERSON,
  );
  const [billingType, setBillingType] = useState(
    orderInfo.billingAddress.customer_type === CustomerType.COMPANY
      ? CustomerType.COMPANY
      : CustomerType.PERSON,
  );

  const validate = {
    email: validateEmail,
    shipping: {
      first_name:
        shippingType === CustomerType.PERSON ? validateFirstName : undefined,
      last_name:
        shippingType === CustomerType.PERSON ? validateLastName : undefined,
      phone: validateNumber,
      company_name:
        shippingType === CustomerType.COMPANY ? validateCompany : undefined,
      nip:
        shippingType === CustomerType.COMPANY ? validateCompanyNip : undefined,
      street: validateStreet,
      building_number: validateBuildingNumber,
      city: validateCity,
      zip: validateZip,
      type: undefined,
      customer_type: undefined,
    },
    billing: {
      first_name:
        billingType === CustomerType.PERSON ? validateFirstName : undefined,
      last_name:
        billingType === CustomerType.PERSON ? validateLastName : undefined,
      phone: validateNumber,
      company_name:
        billingType === CustomerType.COMPANY ? validateCompany : undefined,
      nip:
        billingType === CustomerType.COMPANY ? validateCompanyNip : undefined,
      street: validateStreet,
      building_number: validateBuildingNumber,
      city: validateCity,
      zip: validateZip,
      type: undefined,
      customer_type: undefined,
    },
  };

  const form = useForm<IFormValues>({
    initialValues: {
      email: user.email || "",
      shipping: orderInfo.shippingAddress
        ? {
            ...orderInfo.shippingAddress,
            first_name: orderInfo.shippingAddress.first_name || "",
            last_name: orderInfo.shippingAddress.last_name || "",
            company_name: orderInfo.shippingAddress.company_name || "",
            nip: orderInfo.shippingAddress.nip || "",
          }
        : {
            first_name: "",
            last_name: "",
            phone: "",
            street: "",
            building_number: "",
            flat_number: "",
            city: "",
            zip: "",
            company_name: "",
            nip: "",
            customer_type: CustomerType.PERSON,
            type: AddressType.DELIVERY,
          },
      billing: orderInfo.billingAddress
        ? {
            ...orderInfo.billingAddress,
            first_name: orderInfo.billingAddress.first_name || "",
            last_name: orderInfo.billingAddress.last_name || "",
            company_name: orderInfo.billingAddress.company_name || "",
            nip: orderInfo.billingAddress.nip || "",
          }
        : {
            first_name: "",
            last_name: "",
            phone: "",
            street: "",
            building_number: "",
            flat_number: "",
            city: "",
            zip: "",
            company_name: "",
            nip: "",
            customer_type: CustomerType.PERSON,
            type: AddressType.BILLING,
          },
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  const isValid = form.isValid();

  const handleSubmit = (values: IFormValues) => {
    let same_address = !useDifferentAddress;

    const finalShipping: CreateAddress = {
      ...values.shipping,
      type: AddressType.DELIVERY,
      default: false,
      is_user_address: false,
    };

    let finalBilling: CreateAddress = {
      ...values.billing,
      type: AddressType.BILLING,
      default: false,
      is_user_address: false,
    };

    if (!useDifferentAddress) {
      finalBilling = { ...finalShipping, type: AddressType.BILLING };
    }

    if (user.user_id && finalBilling !== finalShipping) {
      same_address = false;
    }

    dispatch(
      setOrder({
        ...orderInfo,
        shippingAddress: finalShipping,
        billingAddress: finalBilling,
        nip:
          finalBilling.customer_type === CustomerType.COMPANY
            ? finalBilling.nip
            : "",
        customer_email: values.email,
        user_id: user.user_id,
        same_address: same_address,
        order_type:
          finalBilling.customer_type === CustomerType.COMPANY
            ? OrderType.COMPANY
            : OrderType.PRIVATE,
      }),
    );

    navigate("/zamowienie/podsumowanie");
  };

  return (
    <Box id="main-wrapper">
      <Box
        className="main-container flex items-center justify-around flex-col"
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <Box className="main-container">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid container className={"w-full justify-around"}>
              <Grid>
                <ShippingFormFields
                  form={form}
                  setCustomerType={setShippingType}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={useDifferentAddress}
                      onChange={() => setUseDifferentAddress((prev) => !prev)}
                    />
                  }
                  label="Chcę otrzymać fakturę na inne dane"
                />
                {!useDifferentAddress && (
                  <Typography variant="h6" gutterBottom>
                    {!user.user_id
                      ? "Dane do faktury: takie same jak do wysyłki"
                      : "Dane do faktury: domyślne dane z Twojego konta"}
                  </Typography>
                )}
                {useDifferentAddress && (
                  <BillingFormFields
                    form={form}
                    setCustomerType={setBillingType}
                  />
                )}
              </Grid>

              <Grid>
                <CartSummary />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2 }}
                  disabled={!isValid}
                >
                  Przejdź dalej
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderDetails;

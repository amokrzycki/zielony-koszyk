import { Box, Button, Checkbox, Divider, FormControlLabel, Typography } from "@mui/material";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import type { RootState } from "@/store/store";
import { useAppDispatch } from "@/hooks/hooks";
import { useNavigate } from "react-router-dom";

import { AddressType } from "@/enums/AddressType";
import { CustomerType } from "@/enums/CustomerType";
import type { CreateOrder } from "@/types/CreateOrder.ts";
import CartSummary from "@/components/Cart/CartSummary.tsx";
import ShippingFormFields from "@/components/Order/ShippingFormFields.tsx";
import BillingFormFields from "@/components/Order/BillingFormFields.tsx";
import { setOrder } from "@/components/Order/orderSlice.ts";
import type User from "@/types/User.ts";
import { OrderType } from "@/enums/OrderType.ts";
import type { CreateAddress } from "@/types/CreateAddress.ts";
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
import type { Address } from "@/types/Address.ts";
import { accentText, ctaButtonSx, panelSx, tone } from "@/components/listingStyles.ts";

export interface IFormValues {
  shipping: CreateAddress | Address;
  billing: CreateAddress | Address;
  email: string;
}

function OrderDetails() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const orderInfo: CreateOrder = useSelector((state: RootState) => state.order.orderInfo);

  const user: User = useSelector((state: RootState) => state.auth.user);

  const [useDifferentAddress, setUseDifferentAddress] = useState(false);
  const [shippingType, setShippingType] = useState(
    orderInfo.shippingAddress.customer_type === CustomerType.COMPANY ? CustomerType.COMPANY : CustomerType.PERSON,
  );
  const [billingType, setBillingType] = useState(
    orderInfo.billingAddress.customer_type === CustomerType.COMPANY ? CustomerType.COMPANY : CustomerType.PERSON,
  );

  const validate = {
    email: validateEmail,
    shipping: {
      first_name: shippingType === CustomerType.PERSON ? validateFirstName : undefined,
      last_name: shippingType === CustomerType.PERSON ? validateLastName : undefined,
      phone: validateNumber,
      company_name: shippingType === CustomerType.COMPANY ? validateCompany : undefined,
      nip: shippingType === CustomerType.COMPANY ? validateCompanyNip : undefined,
      street: validateStreet,
      building_number: validateBuildingNumber,
      city: validateCity,
      zip: validateZip,
      type: undefined,
      customer_type: undefined,
    },
    billing: {
      first_name: billingType === CustomerType.PERSON && useDifferentAddress ? validateFirstName : undefined,
      last_name: billingType === CustomerType.PERSON && useDifferentAddress ? validateLastName : undefined,
      phone: useDifferentAddress ? validateNumber : undefined,
      company_name: billingType === CustomerType.COMPANY && useDifferentAddress ? validateCompany : undefined,
      nip: billingType === CustomerType.COMPANY && useDifferentAddress ? validateCompanyNip : undefined,
      street: useDifferentAddress ? validateStreet : undefined,
      building_number: useDifferentAddress ? validateBuildingNumber : undefined,
      city: useDifferentAddress ? validateCity : undefined,
      zip: useDifferentAddress ? validateZip : undefined,
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

    const finalShipping = {
      ...values.shipping,
      type: AddressType.DELIVERY,
      default: false,
      is_user_address: false,
    };

    let finalBilling = {
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
        nip: finalBilling.customer_type === CustomerType.COMPANY ? finalBilling.nip : "",
        customer_email: values.email,
        user_id: user.user_id,
        same_address: same_address,
        order_type: finalBilling.customer_type === CustomerType.COMPANY ? OrderType.COMPANY : OrderType.PRIVATE,
      }),
    );

    navigate("/zamowienie/podsumowanie");
  };

  return (
    <Box id="main-wrapper" className="flex flex-col items-center">
      <Box
        className="main-container"
        sx={{
          bgcolor: "background.paper",
        }}>
        <Box className="main-container" sx={{ mt: 0 }}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                component="h1"
                sx={{
                  m: 0,
                  fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}>
                Dostawa i płatność
              </Typography>
              <Typography sx={{ mt: 1, color: "text.secondary", lineHeight: 1.6, maxWidth: "52ch" }}>
                Uzupełnij dane do wysyłki i faktury. Zamówienie potwierdzisz w następnym kroku.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 360px" },
                gap: { xs: 3, lg: 5 },
                alignItems: "start",
              }}>
              <Box sx={(theme) => ({ ...panelSx(theme), p: { xs: 2, sm: 3 } })}>
                <ShippingFormFields form={form} setCustomerType={setShippingType} />

                <Divider sx={{ my: 3 }} />

                <FormControlLabel
                  control={
                    <Checkbox checked={useDifferentAddress} onChange={() => setUseDifferentAddress((prev) => !prev)} />
                  }
                  label="Faktura na inne dane"
                />

                {!useDifferentAddress ? (
                  <Box
                    sx={{
                      mt: 1.5,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      px: 2,
                      py: 1.5,
                      borderRadius: "12px",
                      bgcolor: (theme) => tone(theme, 0.1),
                      color: (theme) => accentText(theme),
                    }}>
                    <ReceiptLongOutlined fontSize="small" sx={{ mt: "1px" }} />
                    <Typography sx={{ color: "inherit", fontSize: "0.9rem", lineHeight: 1.5 }}>
                      {!user.user_id
                        ? "Dane do faktury: takie same jak do wysyłki."
                        : "Dane do faktury: domyślne dane z Twojego konta."}
                    </Typography>
                  </Box>
                ) : (
                  <BillingFormFields form={form} setCustomerType={setBillingType} />
                )}
              </Box>

              <Box
                component="aside"
                aria-label="Podsumowanie zamówienia"
                sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3 } })}>
                <CartSummary />
                <Button type="submit" fullWidth disabled={!isValid} sx={{ ...ctaButtonSx, mt: 3 }}>
                  Przejdź dalej
                </Button>
                {!isValid && (
                  <Typography
                    sx={{
                      mt: 1.5,
                      color: "text.secondary",
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                      textAlign: "center",
                    }}>
                    Uzupełnij wymagane pola, aby przejść dalej.
                  </Typography>
                )}
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderDetails;

import { useParams } from "react-router-dom";
import {
  useGetOrderQuery,
  useUpdateOrderMutation,
} from "@/components/Order/orderApiSlice.ts";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ErrorView from "@/components/common/ErrorView.tsx";
import { useForm } from "@mantine/form";
import { Address } from "@/types/Address.ts";
import ShippingFormFields from "@/components/Order/ShippingFormFields.tsx";
import { IFormValues } from "@/components/Order/OrderDetails.tsx";
import { useState } from "react";
import { CustomerType } from "@/enums/CustomerType.ts";
import BillingFormFields from "@/components/Order/BillingFormFields.tsx";
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
import toast from "react-hot-toast";
import { OrderStatuses } from "@/enums/OrderStatuses.ts";
import { getPolishStatus } from "@/helpers/getPolishStatus.ts";
import { OrderType } from "@/enums/OrderType.ts";

function EditOrderAddresses() {
  const { orderId } = useParams();
  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useGetOrderQuery(orderId as string);
  const [updateOrder] = useUpdateOrderMutation();

  const billingAddress = order?.billingAddress;
  const shippingAddress = order?.shippingAddress;

  const [shippingType, setShippingType] = useState(
    shippingAddress?.customer_type === CustomerType.COMPANY
      ? CustomerType.COMPANY
      : CustomerType.PERSON,
  );
  const [billingType, setBillingType] = useState(
    billingAddress?.customer_type === CustomerType.COMPANY
      ? CustomerType.COMPANY
      : CustomerType.PERSON,
  );

  const [orderStatus, setOrderStatus] = useState(order?.status);

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
      email: order?.customer_email || "",
      shipping: structuredClone(shippingAddress) || ({} as Address),
      billing: structuredClone(billingAddress) || ({} as Address),
    },
    validate,
    validateInputOnBlur: true,
    clearInputErrorOnChange: true,
  });

  if (isOrderLoading) {
    return <CircularProgress />;
  }

  if (isOrderError || !order) {
    return <ErrorView message={"Nie udało się pobrać danych zamówienia"} />;
  }

  const isValid = form.isValid();

  const handleSubmit = (values: IFormValues) => {
    const updatedShipping = {
      ...values.shipping,
      first_name:
        shippingType === CustomerType.PERSON ? values.shipping.first_name : "",
      last_name:
        shippingType === CustomerType.PERSON ? values.shipping.last_name : "",
      company_name:
        shippingType === CustomerType.COMPANY
          ? values.shipping.company_name
          : "",
      nip: shippingType === CustomerType.COMPANY ? values.shipping.nip : "",
      customer_type:
        shippingType === CustomerType.COMPANY
          ? CustomerType.COMPANY
          : CustomerType.PERSON,
    } as Address;

    const updatedBilling = {
      ...values.billing,
      first_name:
        billingType === CustomerType.PERSON ? values.billing.first_name : "",
      last_name:
        billingType === CustomerType.PERSON ? values.billing.last_name : "",
      company_name:
        billingType === CustomerType.COMPANY ? values.billing.company_name : "",
      nip: billingType === CustomerType.COMPANY ? values.billing.nip : "",
      customer_type:
        billingType === CustomerType.COMPANY
          ? CustomerType.COMPANY
          : CustomerType.PERSON,
    } as Address;

    toast
      .promise(
        updateOrder({
          id: order.order_id,
          order: {
            customer_email: values.email,
            shippingAddress: updatedShipping,
            billingAddress: updatedBilling,
            status: orderStatus,
            order_type:
              values.billing.customer_type === CustomerType.COMPANY
                ? OrderType.COMPANY
                : OrderType.PRIVATE,
          },
        }).unwrap(),
        {
          loading: "Zapisywanie zmian...",
          success: "Zmiany zostały zapisane",
          error: "Nie udało się zapisać zmian",
        },
      )
      .then(() => {
        console.log("Zapisano zmiany");
      });
  };

  return (
    <Box>
      <form
        className={"flex items-start gap-8"}
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <Box>
          <ShippingFormFields form={form} setCustomerType={setShippingType} />
          <BillingFormFields form={form} setCustomerType={setBillingType} />
        </Box>
        <Box className={"flex flex-col gap-4"}>
          <Typography variant={"h6"}>Status zamówienia</Typography>
          <Select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            {Object.values(OrderStatuses).map((status) => (
              <MenuItem key={status} value={status}>
                {getPolishStatus(status)}
              </MenuItem>
            ))}
          </Select>
          <Button type={"submit"} disabled={!isValid} variant={"contained"}>
            Zapisz zmiany
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default EditOrderAddresses;

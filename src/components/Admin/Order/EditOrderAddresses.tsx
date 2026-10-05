import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderQuery, useUpdateOrderMutation } from "@/components/Order/orderApiSlice.ts";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import ErrorView from "@/components/common/ErrorView.tsx";
import AdminLoading from "@/components/Admin/AdminLoading.tsx";
import { useForm } from "@mantine/form";
import type { Address } from "@/types/Address.ts";
import ShippingFormFields from "@/components/Order/ShippingFormFields.tsx";
import type { IFormValues } from "@/components/Order/OrderDetails.tsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useLocalePath } from "@/i18n/useLocale.ts";
import { useApiError, useIdentifierLabels } from "../useAdminI18n.ts";
import { OrderType } from "@/enums/OrderType.ts";
import EditOutlined from "@mui/icons-material/EditOutlined";
import AdminPageHeader from "@/components/Admin/AdminPageHeader.tsx";
import { panelSx } from "@/components/listingStyles.ts";
import { adminSubheadingSx } from "@/components/Admin/adminStyles.ts";

function EditOrderAddresses() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("admin");
  const to = useLocalePath();
  const labels = useIdentifierLabels();
  const apiError = useApiError();
  const { data: order, isLoading: isOrderLoading, isError: isOrderError } = useGetOrderQuery(orderId as string);
  const [updateOrder] = useUpdateOrderMutation();

  const billingAddress = order?.billingAddress;
  const shippingAddress = order?.shippingAddress;

  const [shippingType, setShippingType] = useState(
    shippingAddress?.customer_type === CustomerType.COMPANY ? CustomerType.COMPANY : CustomerType.PERSON,
  );
  const [billingType, setBillingType] = useState(
    billingAddress?.customer_type === CustomerType.COMPANY ? CustomerType.COMPANY : CustomerType.PERSON,
  );

  const [orderStatus, setOrderStatus] = useState(order?.status);

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
      first_name: billingType === CustomerType.PERSON ? validateFirstName : undefined,
      last_name: billingType === CustomerType.PERSON ? validateLastName : undefined,
      phone: validateNumber,
      company_name: billingType === CustomerType.COMPANY ? validateCompany : undefined,
      nip: billingType === CustomerType.COMPANY ? validateCompanyNip : undefined,
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
    return (
      <Box sx={{ width: "100%" }}>
        <AdminPageHeader
          icon={<EditOutlined />}
          title={t("editOrder.loadingTitle")}
          subtitle={t("editOrder.loadingSubtitle")}
        />
        <AdminLoading rows={6} />
      </Box>
    );
  }

  if (isOrderError || !order) {
    return <ErrorView message={t("editOrder.loadError")} />;
  }

  const isValid = form.isValid();

  const handleSubmit = (values: IFormValues) => {
    const updatedShipping = {
      ...values.shipping,
      first_name: shippingType === CustomerType.PERSON ? values.shipping.first_name : "",
      last_name: shippingType === CustomerType.PERSON ? values.shipping.last_name : "",
      company_name: shippingType === CustomerType.COMPANY ? values.shipping.company_name : "",
      nip: shippingType === CustomerType.COMPANY ? values.shipping.nip : "",
      customer_type: shippingType === CustomerType.COMPANY ? CustomerType.COMPANY : CustomerType.PERSON,
    } as Address;

    const updatedBilling = {
      ...values.billing,
      first_name: billingType === CustomerType.PERSON ? values.billing.first_name : "",
      last_name: billingType === CustomerType.PERSON ? values.billing.last_name : "",
      company_name: billingType === CustomerType.COMPANY ? values.billing.company_name : "",
      nip: billingType === CustomerType.COMPANY ? values.billing.nip : "",
      customer_type: billingType === CustomerType.COMPANY ? CustomerType.COMPANY : CustomerType.PERSON,
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
            order_type: values.billing.customer_type === CustomerType.COMPANY ? OrderType.COMPANY : OrderType.PRIVATE,
          },
        }).unwrap(),
        {
          loading: t("editOrder.saving"),
          success: t("editOrder.saved"),
          error: (error) => apiError(error, t("editOrder.saveError")),
        },
      )
      .then(() => {
        navigate(to("adminOrderItems", { orderId: order.order_id }));
      });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1000 }}>
      <AdminPageHeader
        icon={<EditOutlined />}
        title={t("editOrder.title", { id: order.order_id })}
        subtitle={t("editOrder.subtitle")}
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 2.5, alignItems: "start" }}>
          <Box sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3.5 } })}>
            <ShippingFormFields form={form} setCustomerType={setShippingType} />
            <BillingFormFields form={form} setCustomerType={setBillingType} />
          </Box>

          <Box sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3.5 }, display: "grid", gap: 2 })}>
            <Typography component="h2" sx={adminSubheadingSx}>
              {t("editOrder.statusHeading")}
            </Typography>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="order-status-label">{t("editOrder.status")}</InputLabel>
              <Select
                labelId="order-status-label"
                label={t("editOrder.status")}
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}>
                {Object.values(OrderStatuses).map((status) => (
                  <MenuItem key={status} value={status}>
                    {labels.status(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              disabled={!isValid && form.isTouched()}
              variant="contained"
              sx={{ borderRadius: "999px", fontWeight: 700, mt: 1 }}>
              {t("editOrder.save")}
            </Button>
            <Button
              variant="text"
              onClick={() => navigate(to("adminOrderItems", { orderId: order.order_id }))}
              sx={{ borderRadius: "999px", fontWeight: 700 }}>
              {t("actions.cancel", { ns: "common" })}
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default EditOrderAddresses;

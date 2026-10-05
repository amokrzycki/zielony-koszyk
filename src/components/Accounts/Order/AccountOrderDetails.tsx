import { useParams } from "react-router-dom";
import type { ReactNode } from "react";
import LoadingOverlay from "@/components/common/LoadingOverlay.tsx";
import { Box, Typography } from "@mui/material";
import { useGetOrderQuery } from "../../Order/orderApiSlice.ts";
import { useTranslation } from "react-i18next";
import { useFormat } from "@/i18n/useLocale.ts";
import OrderStatusPill from "@/components/Order/OrderStatusPill.tsx";
import OrderStatusesInfo from "../../Order/OrderStatusesInfo.tsx";
import { useGetOrderItemsQuery } from "../../Order/orderItemsApiSlice.ts";
import ErrorView from "@/components/common/ErrorView.tsx";
import OrderDetailsTable from "@/components/Accounts/Order/OrderDetailsTable.tsx";
import OrderAddresses from "@/components/Accounts/Order/OrderAddresses.tsx";
import InvoiceDownloadButton from "@/components/Order/InvoiceDownloadButton.tsx";
import { OrderType } from "@/enums/OrderType.ts";
import { panelSx, sectionHeadingSx } from "@/components/listingStyles.ts";

/** One fact in the order summary strip. */
function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box>
      <Typography
        component="dt"
        sx={{
          m: 0,
          color: "text.secondary",
          fontSize: "0.78rem",
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          lineHeight: 1.2,
        }}>
        {label}
      </Typography>
      <Typography component="dd" sx={{ m: 0, mt: 0.75, fontWeight: 700, lineHeight: 1.4, overflowWrap: "anywhere" }}>
        {value}
      </Typography>
    </Box>
  );
}

function AccountOrderDetails() {
  const { orderId } = useParams();
  const { t } = useTranslation("account");
  const { dateTime } = useFormat();
  const {
    data: orderDetails,
    isLoading: isOrderDetailsLoading,
    isError: isOrderDetailsError,
  } = useGetOrderItemsQuery(orderId as string);
  const { data: order, isLoading: isOrderLoading, isError: isOrderError } = useGetOrderQuery(orderId as string);

  if (isOrderDetailsLoading || isOrderLoading) {
    return <LoadingOverlay />;
  }

  if (isOrderDetailsError || isOrderError || !orderDetails || !order) {
    return (
      <div className="fade-in">
        <ErrorView message={t("orderDetails.error")} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Box sx={{ maxWidth: 760, mx: "auto", textAlign: "left" }}>
        <Box
          sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", minWidth: 0 }}>
            <Typography
              component="h1"
              sx={{
                m: 0,
                fontSize: { xs: "1.7rem", md: "2.05rem" },
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}>
              {t("orderDetails.title", { id: order.order_id })}
            </Typography>
            <OrderStatusPill status={order.status} size="md" />
          </Box>
          <InvoiceDownloadButton orderId={order.order_id} />
        </Box>

        <Box
          component="dl"
          sx={(theme) => ({
            ...panelSx(theme),
            m: 0,
            mt: { xs: 3, md: 3.5 },
            px: { xs: 2.5, sm: 3 },
            py: { xs: 2, sm: 2.25 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            "& > * + *": {
              borderColor: "divider",
              borderTopStyle: "solid",
              borderLeftStyle: "solid",
              borderTopWidth: { xs: 1, sm: 0 },
              borderLeftWidth: { xs: 0, sm: 1 },
              pt: { xs: 2, sm: 0 },
              pl: { xs: 0, sm: 3 },
            },
          })}>
          <Fact
            label={t("orderDetails.type")}
            value={
              order.order_type === OrderType.COMPANY ? t("orderDetails.typeCompany") : t("orderDetails.typePrivate")
            }
          />
          <Fact label={t("orderDetails.date")} value={dateTime(order.order_date)} />
          <Fact label={t("orderDetails.contact")} value={order.customer_email} />
        </Box>

        <Box component="section" sx={{ mt: { xs: 3.5, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
            <Typography component="h2" sx={sectionHeadingSx}>
              {t("orderDetails.products")}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", fontWeight: 600, whiteSpace: "nowrap" }}>
              {t("orderDetails.positions", {
                count: orderDetails.filter((item) => item.item_type !== "DELIVERY").length,
              })}
            </Typography>
          </Box>
          <OrderDetailsTable orderDetails={orderDetails} />
        </Box>

        <Box component="section" sx={{ mt: { xs: 3.5, md: 4 } }}>
          <Typography component="h2" sx={{ ...sectionHeadingSx, mb: 1.5 }}>
            {t("orderDetails.addresses")}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <OrderAddresses order={order} />
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 3.5, md: 4 } }}>
          <OrderStatusesInfo />
        </Box>
      </Box>
    </div>
  );
}

export default AccountOrderDetails;

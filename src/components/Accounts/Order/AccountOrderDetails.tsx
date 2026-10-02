import { useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetOrderQuery } from "../../Order/orderApiSlice.ts";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
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

/** Polish plural for the line-item count. */
const itemCountLabel = (count: number) => {
  if (count === 1) return "1 pozycja";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} pozycje`;
  return `${count} pozycji`;
};

function AccountOrderDetails() {
  const { orderId } = useParams();
  const {
    data: orderDetails,
    isLoading: isOrderDetailsLoading,
    isError: isOrderDetailsError,
  } = useGetOrderItemsQuery(orderId as string);
  const { data: order, isLoading: isOrderLoading, isError: isOrderError } = useGetOrderQuery(orderId as string);

  if (isOrderDetailsLoading || isOrderLoading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isOrderDetailsError || isOrderError || !orderDetails || !order) {
    return <ErrorView message={"Nie udało się pobrać danych zamówienia"} />;
  }

  return (
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
            Zamówienie #{order.order_id}
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
        <Fact label="Typ zamówienia" value={order.order_type === OrderType.COMPANY ? "Firma" : "Osoba prywatna"} />
        <Fact label="Data złożenia" value={getFormattedDate(order.order_date)} />
        <Fact label="Kontakt" value={order.customer_email} />
      </Box>

      <Box component="section" sx={{ mt: { xs: 3.5, md: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
          <Typography component="h2" sx={sectionHeadingSx}>
            Produkty
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", fontWeight: 600, whiteSpace: "nowrap" }}>
            {itemCountLabel(orderDetails.length)}
          </Typography>
        </Box>
        <OrderDetailsTable orderDetails={orderDetails} />
      </Box>

      <Box component="section" sx={{ mt: { xs: 3.5, md: 4 } }}>
        <Typography component="h2" sx={{ ...sectionHeadingSx, mb: 1.5 }}>
          Dane do faktury i dostawy
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <OrderAddresses order={order} />
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 3.5, md: 4 } }}>
        <OrderStatusesInfo />
      </Box>
    </Box>
  );
}

export default AccountOrderDetails;

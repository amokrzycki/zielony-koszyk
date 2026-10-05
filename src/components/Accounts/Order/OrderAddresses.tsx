import type { Order } from "@/types/Order.ts";
import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import { OrderType } from "@/enums/OrderType.ts";
import { CustomerType } from "@/enums/CustomerType.ts";
import { useTranslation } from "react-i18next";
import { useFormat } from "@/i18n/useLocale.ts";
import { DELIVERY_FEE } from "@/reducers/cartReducers.ts";
import { generateOrderAddress } from "@/helpers/generateOrderAddress.ts";
import { accentText, panelSx, tone } from "@/components/listingStyles.ts";

interface OrderAddressesProps {
  order: Order;
}

const lineSx = { color: "text.secondary", fontSize: "0.9rem", lineHeight: 1.5 } as const;

function AddressCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <Box component="section" sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3 }, height: "100%" })}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
        <Box
          aria-hidden
          sx={{
            display: "grid",
            placeItems: "center",
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: "50%",
            bgcolor: (t) => tone(t, 0.12),
            color: (t) => accentText(t),
            "& svg": { fontSize: 19 },
          }}>
          {icon}
        </Box>
        <Typography component="h3" sx={{ m: 0, fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>{children}</Box>
    </Box>
  );
}

function OrderAddresses({ order }: OrderAddressesProps) {
  const { t } = useTranslation("account");
  const { currency } = useFormat();
  const billing = order.billingAddress;
  const shipping = order.shippingAddress;
  const billingIsCompany = order.order_type === OrderType.COMPANY;
  const shippingIsCompany = shipping.customer_type === CustomerType.COMPANY;

  return (
    <>
      <AddressCard icon={<ReceiptLongOutlined />} title={t("orderAddresses.billing")}>
        <Typography sx={{ fontWeight: 700, lineHeight: 1.4 }}>
          {billingIsCompany ? billing.company_name : `${billing.first_name} ${billing.last_name}`}
        </Typography>
        {billingIsCompany && <Typography sx={lineSx}>{t("orderAddresses.nip", { nip: billing.nip })}</Typography>}
        <Typography sx={lineSx}>{order.customer_email}</Typography>
        <Typography sx={lineSx}>{billing.phone}</Typography>
        <Typography sx={lineSx}>{generateOrderAddress(billing)}</Typography>
      </AddressCard>

      <AddressCard icon={<PlaceOutlined />} title={t("orderAddresses.shipping")}>
        <Typography sx={{ fontWeight: 700, lineHeight: 1.4 }}>
          {shippingIsCompany ? shipping.company_name : `${shipping.first_name} ${shipping.last_name}`}
        </Typography>
        {shippingIsCompany && <Typography sx={lineSx}>{t("orderAddresses.nip", { nip: shipping.nip })}</Typography>}
        <Typography sx={lineSx}>{shipping.phone}</Typography>
        <Typography sx={lineSx}>{generateOrderAddress(shipping)}</Typography>
        <Box
          sx={{
            mt: 1,
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.25,
            py: 0.4,
            borderRadius: "999px",
            bgcolor: (t) => tone(t, 0.1),
            color: (t) => accentText(t),
            fontSize: "0.8rem",
            fontWeight: 700,
          }}>
          <LocalShippingOutlined sx={{ fontSize: 15 }} />
          {t("orderAddresses.courier", { price: currency(DELIVERY_FEE) })}
        </Box>
      </AddressCard>
    </>
  );
}

export default OrderAddresses;

import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OrderStatuses } from "@/enums/OrderStatuses.ts";
import { accentText, tone } from "@/components/listingStyles.ts";

/** Delivered and completed orders read as closed; everything before them is still in motion. */
const isClosed = (status: string) => status === OrderStatuses.DELIVERED || status === OrderStatuses.DONE;

const isKnown = (status: string): status is OrderStatuses => status in OrderStatuses;

interface OrderStatusPillProps {
  status: string;
  /** `md` sits beside a page title; `sm` is the inline default used in the order list. */
  size?: "sm" | "md";
}

function OrderStatusPill({ status, size = "sm" }: OrderStatusPillProps) {
  const { t } = useTranslation("common");
  const closed = isClosed(status);
  const md = size === "md";

  return (
    <Box
      component="span"
      sx={(theme) => ({
        display: "inline-flex",
        alignItems: "center",
        gap: md ? 1 : 0.75,
        px: md ? 1.75 : 1.25,
        py: md ? 0.65 : 0.4,
        borderRadius: "999px",
        bgcolor: closed ? "action.hover" : tone(theme, 0.12),
        color: closed ? "text.secondary" : accentText(theme),
        fontSize: md ? "0.9rem" : "0.78rem",
        fontWeight: 700,
        lineHeight: 1.3,
        whiteSpace: "nowrap",
      })}>
      <Box
        component="span"
        aria-hidden
        sx={{ width: md ? 8 : 7, height: md ? 8 : 7, borderRadius: "50%", bgcolor: "currentColor" }}
      />
      {t(`orderStatus.${isKnown(status) ? status : OrderStatuses.NEW}`)}
    </Box>
  );
}

export default OrderStatusPill;

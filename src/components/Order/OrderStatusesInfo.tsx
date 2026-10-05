import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import { accentText, panelSx, sectionHeadingSx } from "@/components/listingStyles.ts";

const statuses = [
  "NEW",
  "WAITING_FOR_PAYMENT",
  "WAITING_FOR_CONFIRMATION",
  "IN_PROGRESS",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "DONE",
] as const;

function OrderStatusesInfo() {
  const { t } = useTranslation("checkout");
  return (
    <Box
      component="section"
      aria-labelledby="order-statuses-heading"
      sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3 } })}>
      <Typography component="h2" id="order-statuses-heading" sx={{ ...sectionHeadingSx, mb: 0 }}>
        {t("statusInfo.title")}
      </Typography>
      <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: "0.9rem", lineHeight: 1.55, maxWidth: "60ch" }}>
        {t("statusInfo.subtitle")}
      </Typography>
      <Box
        component="dl"
        sx={{
          m: 0,
          mt: 2.5,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          columnGap: 4,
        }}>
        {statuses.map((status) => (
          <Box
            key={status}
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              columnGap: 1.5,
              alignItems: "start",
              py: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
            }}>
            <Box
              aria-hidden
              sx={{ mt: "6px", width: 7, height: 7, borderRadius: "50%", bgcolor: (t) => accentText(t) }}
            />
            <Box>
              <Typography component="dt" sx={{ fontWeight: 700, lineHeight: 1.35 }}>
                {t(`statusInfo.items.${status}.name`)}
              </Typography>
              <Typography
                component="dd"
                sx={{ m: 0, mt: 0.25, color: "text.secondary", fontSize: "0.88rem", lineHeight: 1.5 }}>
                {t(`statusInfo.items.${status}.description`)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default OrderStatusesInfo;

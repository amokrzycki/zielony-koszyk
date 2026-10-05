import { Box, Button, Typography } from "@mui/material";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";
import { EASE, ctaButtonSx, panelSx, tone } from "@/components/listingStyles.ts";

function OrderConfirm() {
  const { t } = useTranslation("checkout");
  const to = useLocalePath();
  return (
    <Box id="main-wrapper" className="flex flex-col items-center">
      <Box className="main-container" sx={{ bgcolor: "background.paper" }}>
        <Box className="main-container" sx={{ mt: 0 }}>
          <Box
            component="section"
            aria-labelledby="order-confirm-heading"
            sx={(theme) => ({
              ...panelSx(theme),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              px: 3,
              py: { xs: 7, sm: 10 },
            })}>
            <Box
              aria-hidden="true"
              sx={{
                display: "grid",
                placeItems: "center",
                width: 64,
                height: 64,
                mb: 2,
                borderRadius: "50%",
                color: "primary.main",
                bgcolor: (t) => tone(t, 0.12),
                animation: `orderConfirmPop 560ms ${EASE} both`,
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                "@keyframes orderConfirmPop": {
                  from: { opacity: 0, transform: "scale(0.7)" },
                  to: { opacity: 1, transform: "scale(1)" },
                },
                "& svg": { fontSize: 30 },
              }}>
              <CheckRounded />
            </Box>

            <Typography
              component="h1"
              id="order-confirm-heading"
              sx={{
                m: 0,
                fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                textWrap: "balance",
              }}>
              {t("confirm.title")}
            </Typography>

            <Typography sx={{ mt: 1.5, color: "text.secondary", lineHeight: 1.6, maxWidth: "42ch" }}>
              {t("confirm.text")}
            </Typography>

            <Button component={Link} to={to("products")} sx={{ ...ctaButtonSx, mt: 3 }}>
              {t("confirm.back")}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderConfirm;

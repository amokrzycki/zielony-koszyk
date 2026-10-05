import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";
import { ctaButtonSx, ghostButtonSx, panelSx, tone } from "@/components/listingStyles.ts";

function OrderNoAccount() {
  const navigate = useNavigate();
  const { t } = useTranslation("checkout");
  const to = useLocalePath();
  return (
    <Box
      sx={(theme) => ({
        ...panelSx(theme),
        p: { xs: 3, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      })}>
      <Typography component="h2" sx={{ m: 0, mb: 1, fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
        {t("noAccount.title")}
      </Typography>
      <Typography sx={{ mb: 3, color: "text.secondary", lineHeight: 1.55 }}>{t("noAccount.text")}</Typography>
      <Button onClick={() => navigate(to("order"))} sx={ctaButtonSx}>
        {t("noAccount.guest")}
      </Button>
      <Typography sx={{ my: 1.5, color: "text.secondary", fontSize: "0.9rem" }}>{t("noAccount.or")}</Typography>
      <Button
        onClick={() => navigate(to("login", undefined, { search: "tab=1" }))}
        sx={(theme) => ghostButtonSx(theme)}>
        {t("noAccount.register")}
      </Button>
      <Box sx={{ mt: 3, p: 2, borderRadius: "16px", bgcolor: (t) => tone(t, 0.08), width: "100%" }}>
        <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{t("noAccount.benefits")}</Typography>
      </Box>
    </Box>
  );
}

export default OrderNoAccount;

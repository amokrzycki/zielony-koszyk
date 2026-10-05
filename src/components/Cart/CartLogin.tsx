import { Box, Button, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import OrderNoAccount from "../Order/OrderNoAccount.tsx";
import LoginForm from "../Accounts/LoginForm.tsx";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMode } from "@/providers/ModeProvider.tsx";
import { ghostButtonSx, panelSx } from "@/components/listingStyles.ts";

function CartLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation("checkout");
  const { mode } = useMode();
  return (
    <Box id="main-wrapper" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        className="main-container"
        sx={{
          bgcolor: "transparent",
          p: 0,
          maxWidth: 1080,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, md: 4 },
        }}>
        <Box
          component="img"
          src={`/${mode}_logo.png`}
          alt={t("app.name", { ns: "common" })}
          sx={{ height: { xs: 72, md: 84 }, width: "auto" }}
        />
        <Typography
          component="h1"
          sx={{
            m: 0,
            textAlign: "center",
            fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            textWrap: "balance",
            maxWidth: "24ch",
          }}>
          {t("cartLogin.title")}
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            alignItems: "stretch",
            gap: { xs: 3, md: 4 },
          }}>
          <Box
            sx={(theme) => ({
              ...panelSx(theme),
              p: { xs: 3, sm: 4 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            })}>
            <Typography
              component="h2"
              sx={{ m: 0, mb: 1, fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {t("cartLogin.haveAccount")}
            </Typography>
            <Typography sx={{ mb: 3, color: "text.secondary", lineHeight: 1.55 }}>
              {t("cartLogin.haveAccountText")}
            </Typography>
            <LoginForm />
          </Box>
          <OrderNoAccount />
        </Box>

        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />} sx={(theme) => ghostButtonSx(theme)}>
          {t("cartLogin.backToCart")}
        </Button>
      </Box>
    </Box>
  );
}

export default CartLogin;

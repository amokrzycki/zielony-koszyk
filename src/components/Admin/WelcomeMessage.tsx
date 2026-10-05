import { Box, Button, Typography } from "@mui/material";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import SellOutlined from "@mui/icons-material/SellOutlined";
import GroupOutlined from "@mui/icons-material/GroupOutlined";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks/hooks.ts";
import type { RootState } from "@/store/store.ts";
import { panelSx, accentText, EASE, tone } from "@/components/listingStyles.ts";
import { useLocalePath } from "@/i18n/useLocale.ts";

const sections = [
  { icon: Inventory2Outlined, id: "products", route: "adminProducts" },
  { icon: SellOutlined, id: "orders", route: "adminOrders" },
  { icon: GroupOutlined, id: "users", route: "adminUsers" },
] as const;

function WelcomeMessage() {
  const navigate = useNavigate();
  const { t } = useTranslation("admin");
  const to = useLocalePath();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const firstName = user?.first_name?.trim();

  return (
    <Box sx={{ pb: 2 }}>
      <Box
        sx={(theme) => ({
          ...panelSx(theme),
          position: "relative",
          overflow: "hidden",
          p: { xs: 3, sm: 4 },
          mb: 3,
          backgroundImage:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle at 100% 0%, rgba(0,206,124,0.16), transparent 45%)"
              : "radial-gradient(circle at 100% 0%, rgba(0,206,124,0.10), transparent 45%)",
        })}>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontSize: { xs: "1.6rem", md: "2rem" },
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: "-0.03em",
            textWrap: "balance",
          }}>
          {firstName ? t("welcome.greeting", { name: firstName }) : t("welcome.greetingAnonymous")}
        </Typography>
        <Typography sx={{ mt: 1.5, maxWidth: "60ch", color: "text.secondary", lineHeight: 1.6 }}>
          {t("welcome.intro")}
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
        {sections.map(({ icon: Icon, id, route }) => (
          <Button
            key={route}
            onClick={() => navigate(to(route))}
            sx={(theme) => ({
              ...panelSx(theme),
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1.5,
              p: 3,
              textAlign: "left",
              textTransform: "none",
              borderRadius: "24px",
              transition: `transform 300ms ${EASE}, box-shadow 300ms ${EASE}, border-color 300ms ${EASE}`,
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: "primary.main",
                boxShadow:
                  theme.palette.mode === "dark" ? "0 22px 50px rgba(0,0,0,0.6)" : "0 22px 50px rgba(15,40,28,0.16)",
              },
              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
            })}>
            <Box
              aria-hidden
              sx={(theme) => ({
                display: "grid",
                placeItems: "center",
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: tone(theme, 0.12),
                color: accentText(theme),
                "& svg": { fontSize: 22 },
              })}>
              <Icon />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.01em", color: "text.primary" }}>
              {t(`nav.items.${id}.label`)}
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", lineHeight: 1.5 }}>
              {t(`welcome.sections.${id}`)}
            </Typography>
            <Box
              sx={(theme) => ({
                mt: 0.5,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                color: accentText(theme),
                fontWeight: 700,
                fontSize: "0.9rem",
              })}>
              {t("welcome.go")}
              <ArrowForward sx={{ fontSize: 18 }} />
            </Box>
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default WelcomeMessage;

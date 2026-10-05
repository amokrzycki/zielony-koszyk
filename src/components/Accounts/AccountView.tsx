import { Avatar, Box, Button, Typography } from "@mui/material";
import CheckRounded from "@mui/icons-material/CheckRounded";
import SwapLayers from "../common/SwapLayers.tsx";
import AutoBreadcrumbs from "../AutoBreadcrumbs.tsx";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";
import type User from "../../types/User.ts";
import { useAppSelector } from "@/hooks/hooks.ts";
import type { RootState } from "@/store/store.ts";
import { useMode } from "@/providers/ModeProvider.tsx";
import { accentText, ctaButtonSx, panelSx, tone } from "@/components/listingStyles.ts";

const accountBenefits = ["orders", "addresses", "security"] as const;

/** Subpage swap: the panel tweens between page heights instead of jumping. */
function AccountOutlet() {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  return <SwapLayers id={pathname}>{outlet}</SwapLayers>;
}

function AccountView() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const { t } = useTranslation(["account", "common"]);
  const to = useLocalePath();
  const { mode } = useMode();

  if (Object.keys(user).length === 0) {
    return (
      <Box id="main-wrapper" sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 5, md: 8 }, pb: { xs: 8, md: 12 } }}>
        <Box
          sx={(theme) => ({
            ...panelSx(theme),
            maxWidth: 560,
            mx: "auto",
            px: { xs: 3, sm: 5 },
            py: { xs: 4, sm: 6 },
            textAlign: "center",
            backgroundImage:
              theme.palette.mode === "dark"
                ? "radial-gradient(circle at 50% -10%, rgba(0,206,124,0.18), transparent 60%)"
                : "radial-gradient(circle at 50% -10%, rgba(0,206,124,0.12), transparent 60%)",
          })}>
          <Box
            component="img"
            src={`/${mode}_logo.png`}
            alt={t("app.name", { ns: "common" })}
            sx={{ height: { xs: 60, md: 72 }, width: "auto" }}
          />
          <Typography
            component="h1"
            sx={{
              mt: 3,
              mx: "auto",
              maxWidth: "20ch",
              fontSize: { xs: "1.6rem", md: "2rem" },
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              textWrap: "balance",
            }}>
            {t("view.loginTitle")}
          </Typography>
          <Typography sx={{ mt: 2, mx: "auto", maxWidth: "40ch", color: "text.secondary", lineHeight: 1.6 }}>
            {t("view.loginText")}
          </Typography>
          <Box
            component="ul"
            sx={{
              mt: 3.5,
              mb: 0,
              p: 0,
              listStyle: "none",
              display: "grid",
              gap: 1.25,
              width: "fit-content",
              mx: "auto",
              textAlign: "left",
            }}>
            {accountBenefits.map((benefit) => (
              <Box component="li" key={benefit} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: (t) => tone(t, 0.12),
                    color: (t) => accentText(t),
                    "& svg": { fontSize: 15 },
                  }}>
                  <CheckRounded />
                </Box>
                <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.45 }}>{t(`view.benefits.${benefit}`)}</Typography>
              </Box>
            ))}
          </Box>
          <Button
            onClick={() => {
              navigate(to("login"));
            }}
            sx={{ ...ctaButtonSx, mt: 4, minWidth: 200 }}>
            {t("view.login")}
          </Button>
        </Box>
      </Box>
    );
  }

  const initial = (user.first_name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <Box id="main-wrapper" sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 3, md: 5 }, pb: { xs: 8, md: 12 } }}>
      <Box
        sx={(theme) => ({
          ...panelSx(theme),
          maxWidth: 1080,
          mx: "auto",
          overflow: "hidden",
          backgroundImage:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle at 100% 0%, rgba(0,206,124,0.14), transparent 40%)"
              : "radial-gradient(circle at 100% 0%, rgba(0,206,124,0.10), transparent 40%)",
        })}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            px: { xs: 2.5, sm: 4 },
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}>
          <Box sx={{ minWidth: 0 }}>
            <AutoBreadcrumbs />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              pl: 0.75,
              pr: 1.75,
              py: 0.5,
              borderRadius: "999px",
              bgcolor: (t) => tone(t, 0.08),
            }}>
            <Avatar
              aria-hidden
              sx={{
                width: 28,
                height: 28,
                bgcolor: (t) => tone(t, 0.18),
                color: (t) => accentText(t),
                fontSize: "0.875rem",
                fontWeight: 800,
              }}>
              {initial}
            </Avatar>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, lineHeight: 1.2 }}>
              {t("view.welcome", { name: user.first_name })}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 2.5, sm: 4 }, py: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <AccountOutlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AccountView;

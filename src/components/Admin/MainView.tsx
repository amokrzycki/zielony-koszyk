import { useState } from "react";
import { Avatar, Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CheckRounded from "@mui/icons-material/CheckRounded";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import SwapLayers from "../common/SwapLayers.tsx";
import Navigation from "./Navigation.tsx";
import { useAppSelector } from "@/hooks/hooks.ts";
import type { RootState } from "@/store/store.ts";
import type User from "@/types/User.ts";
import AutoBreadcrumbs from "../AutoBreadcrumbs.tsx";
import { useMode } from "@/providers/ModeProvider.tsx";
import { BRAND_INK, accentText, ctaButtonSx, panelSx, tone } from "@/components/listingStyles.ts";

const adminBenefits = [
  "Produkty, stany magazynowe i zdjęcia",
  "Zamówienia, adresy i ich statusy",
  "Konta klientów oraz role",
];

const RAIL_WIDTH = 264;

/** Warm-linen page gutter + shared width for the console. */
const shellSx = {
  px: { xs: 2, sm: 3 },
  pt: { xs: 3, md: 5 },
  pb: { xs: 8, md: 12 },
} as const;

/** Subpage swap: the work surface fades and eases between page heights instead of jumping. */
function AdminOutlet() {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  return <SwapLayers id={pathname}>{outlet}</SwapLayers>;
}

function AdminAccountBlock({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const initial = (user.first_name || user.email || "?").trim().charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 1.5,
        borderRadius: "16px",
        bgcolor: "rgba(255,255,255,0.05)",
      }}>
      <Avatar sx={{ width: 40, height: 40, bgcolor: "rgba(0,206,124,0.2)", color: "#00ce7c", fontWeight: 800 }}>
        {initial}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.92rem", lineHeight: 1.25 }} noWrap>
          {user.first_name || "Administrator"}
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem" }} noWrap>
          {user.email}
        </Typography>
      </Box>
      <Button
        onClick={() => {
          onNavigate?.();
          navigate("/");
        }}
        sx={(theme) => ({
          minWidth: 0,
          px: 1.25,
          py: 0.5,
          borderRadius: "999px",
          color: accentText(theme),
          fontWeight: 700,
          fontSize: "0.78rem",
          transition: `background-color 200ms cubic-bezier(0.16,1,0.3,1)`,
          "&:hover": { backgroundColor: "rgba(0,206,124,0.14)" },
        })}>
        Sklep
      </Button>
    </Box>
  );
}

function RailBody({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  const { mode } = useMode();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 2.5,
        px: 2,
        py: 2.5,
        bgcolor: BRAND_INK,
        backgroundImage: "radial-gradient(circle at 0% 0%, rgba(0,206,124,0.16), transparent 45%)",
      }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 0.5 }}>
        <Box
          component="img"
          src={`/${mode}_logo.png`}
          alt="Zielony Koszyk"
          role="button"
          tabIndex={0}
          onClick={() => {
            onNavigate?.();
            navigate("/admin");
          }}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onNavigate?.();
              navigate("/admin");
            }
          }}
          sx={{ height: 38, width: "auto", ml: 0.5, cursor: "pointer" }}
        />
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            onClick={() => onNavigate?.()}
            aria-label="Zamknij nawigację"
            size="small"
            sx={{ color: "rgba(255,255,255,0.72)", "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box>
        <Navigation onNavigate={onNavigate} />
      </Box>
      <Box sx={{ flex: 1 }} />
      <AdminAccountBlock user={user} onNavigate={onNavigate} />
    </Box>
  );
}

function MainView() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (Object.keys(user).length === 0) {
    return (
      <Box id="main-wrapper" sx={shellSx}>
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
          <Typography
            component="h1"
            sx={{
              m: 0,
              mx: "auto",
              maxWidth: "22ch",
              fontSize: { xs: "1.6rem", md: "2rem" },
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              textWrap: "balance",
            }}>
            Zaloguj się, aby uruchomić panel administracyjny
          </Typography>
          <Typography sx={{ mt: 2, mx: "auto", maxWidth: "40ch", color: "text.secondary", lineHeight: 1.6 }}>
            Zarządzanie produktami, zamówieniami i klientami czeka po zalogowaniu.
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
            {adminBenefits.map((benefit) => (
              <Box component="li" key={benefit} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={(theme) => ({
                    display: "grid",
                    placeItems: "center",
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: tone(theme, 0.12),
                    color: accentText(theme),
                    "& svg": { fontSize: 15 },
                  })}>
                  <CheckRounded />
                </Box>
                <Typography sx={{ fontSize: "0.95rem", lineHeight: 1.45 }}>{benefit}</Typography>
              </Box>
            ))}
          </Box>
          <Button onClick={() => navigate("/login")} sx={{ ...ctaButtonSx, mt: 4, minWidth: 200 }}>
            Zaloguj się
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box id="main-wrapper" sx={shellSx}>
      <Box
        sx={(theme) => ({
          ...panelSx(theme),
          maxWidth: 1560,
          mx: "auto",
          overflow: "hidden",
        })}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: `${RAIL_WIDTH}px 1fr` } }}>
          <Box sx={{ display: { xs: "none", md: "block" }, minHeight: 640 }}>
            <RailBody user={user} />
          </Box>

          <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.5,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Otwórz nawigację panelu"
                aria-controls="admin-drawer"
                aria-expanded={drawerOpen}
                sx={(theme) => ({ color: "text.primary", "&:hover": { bgcolor: tone(theme, 0.1) } })}>
                <MenuIcon />
              </IconButton>
              <Typography sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Panel administracyjny</Typography>
            </Box>

            <Box sx={{ px: { xs: 2.5, sm: 4 }, py: { xs: 3, sm: 4 }, minWidth: 0 }}>
              <Box sx={{ mb: 2.5 }}>
                <AutoBreadcrumbs />
              </Box>
              <AdminOutlet />
            </Box>
          </Box>
        </Box>
      </Box>

      <Drawer
        id="admin-drawer"
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: RAIL_WIDTH, bgcolor: BRAND_INK, backgroundImage: "none", border: 0 },
        }}>
        <Box sx={{ height: "100%" }}>
          <RailBody user={user} onNavigate={() => setDrawerOpen(false)} />
        </Box>
      </Drawer>
    </Box>
  );
}

export default MainView;

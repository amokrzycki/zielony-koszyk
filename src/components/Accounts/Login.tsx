import { Box, Tab, Tabs, Typography } from "@mui/material";
import CheckRounded from "@mui/icons-material/CheckRounded";
import type React from "react";
import { useState } from "react";
import RegisterForm from "./RegisterForm.tsx";
import LoginForm from "./LoginForm.tsx";
import { BRAND_INK, EASE, accentText, panelSx, tone } from "@/components/listingStyles.ts";

const brandPoints = [
  "Codzienna dostawa w Rzeszowie i okolicach",
  "Produkty z ekologicznych upraw",
  "Ceny hurtowe przy większych zamówieniach",
];

const brandCopy = [
  {
    title: "Witaj z powrotem.",
    body: "Zaloguj się, aby dokończyć zakupy, śledzić zamówienia i wracać do ulubionych produktów.",
  },
  {
    title: "Zacznij z Zielonym Koszykiem.",
    body: "Konto to szybsze zakupy, podgląd statusów zamówień i cała historia Twoich dostaw.",
  },
];

function Login() {
  const query = new URLSearchParams(window.location.search);
  const [tab, setTab] = useState<number>(query.get("tab") === "1" ? 1 : 0);
  const copy = brandCopy[tab] ?? brandCopy[0];

  const handleTabChange = (_: React.SyntheticEvent, tabNumber: number) => {
    setTab(tabNumber);
  };

  return (
    <Box id="main-wrapper" sx={{ px: { xs: 2, sm: 3 } }}>
      <Box
        className="main-container"
        sx={(theme) => ({
          ...panelSx(theme),
          maxWidth: 1080,
          p: 0,
        })}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1.05fr" },
            alignItems: "stretch",
          }}>
          <Box
            sx={{
              position: "relative",
              bgcolor: BRAND_INK,
              color: "#fff",
              p: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: { xs: 4, md: 6 },
              backgroundImage: "radial-gradient(circle at 84% 6%, rgba(0,206,124,0.20), transparent 58%)",
            }}>
            <Box
              component="img"
              src="/dark_logo.png"
              alt="Zielony Koszyk"
              sx={{ height: 52, width: "auto", alignSelf: "flex-start" }}
            />
            <Box>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "1.9rem", md: "2.35rem" },
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  textWrap: "balance",
                }}>
                {copy.title}
              </Typography>
              <Typography sx={{ mt: 2, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, maxWidth: "42ch" }}>
                {copy.body}
              </Typography>
              <Box component="ul" sx={{ mt: 4, listStyle: "none", p: 0, display: "grid", gap: 1.5 }}>
                {brandPoints.map((point) => (
                  <Box component="li" key={point} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        width: 24,
                        height: 24,
                        flexShrink: 0,
                        borderRadius: "50%",
                        color: "primary.main",
                        bgcolor: "rgba(0,206,124,0.16)",
                        "& svg": { fontSize: 15 },
                      }}>
                      <CheckRounded />
                    </Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", lineHeight: 1.45 }}>
                      {point}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              p: { xs: 3, sm: 5, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
            }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              aria-label="logowanie"
              variant="fullWidth"
              sx={(theme) => ({
                minHeight: 0,
                mb: 4,
                p: 0.5,
                bgcolor: tone(theme, 0.08),
                borderRadius: "999px",
                "& .MuiTabs-flexContainer": { gap: 0.5 },
                "& .MuiTabs-indicator": {
                  height: "100%",
                  borderRadius: "999px",
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.14)" : "background.paper",
                  transition: `all 300ms ${EASE}`,
                },
                "& .MuiTab-root": {
                  zIndex: 1,
                  minHeight: 0,
                  py: 1.1,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "text.secondary",
                },
                "& .Mui-selected": { color: accentText(theme) },
              })}>
              <Tab label="Logowanie" disableRipple />
              <Tab label="Nowe konto" disableRipple />
            </Tabs>
            <Box className={"flex justify-center flex-wrap"}>
              {tab === 0 ? <LoginForm /> : <RegisterForm setTab={setTab} />}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;

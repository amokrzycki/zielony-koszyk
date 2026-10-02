import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ctaButtonSx, ghostButtonSx, panelSx, tone } from "@/components/listingStyles.ts";

function OrderNoAccount() {
  const navigate = useNavigate();
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
        Nie mam konta
      </Typography>
      <Typography sx={{ mb: 3, color: "text.secondary", lineHeight: 1.55 }}>
        Kup bez rejestracji albo załóż konto, aby wracać do historii zamówień.
      </Typography>
      <Button onClick={() => navigate("/zamowienie")} sx={ctaButtonSx}>
        Kup bez rejestracji
      </Button>
      <Typography sx={{ my: 1.5, color: "text.secondary", fontSize: "0.9rem" }}>lub</Typography>
      <Button onClick={() => navigate("/login?tab=1")} sx={(theme) => ghostButtonSx(theme)}>
        Utwórz konto
      </Button>
      <Box sx={{ mt: 3, p: 2, borderRadius: "16px", bgcolor: (t) => tone(t, 0.08), width: "100%" }}>
        <Typography sx={{ fontSize: "0.875rem", lineHeight: 1.6 }}>
          Zakładając konto, będziesz mógł dokonywać zakupów szybciej, być na bieżąco z statusami zamówień oraz śledzić
          historię swoich zakupów.
        </Typography>
      </Box>
    </Box>
  );
}

export default OrderNoAccount;

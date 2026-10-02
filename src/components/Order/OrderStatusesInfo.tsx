import { Box, Typography } from "@mui/material";
import { accentText, panelSx, sectionHeadingSx } from "@/components/listingStyles.ts";

const statuses = [
  {
    name: "Nowe",
    description: "Zamówienie nie zostało jeszcze potwierdzone i proces realizacji jeszcze się nie rozpoczął.",
  },
  { name: "W oczekiwaniu na płatność", description: "Zamówienie oczekuje na potwierdzenie płatności." },
  { name: "W oczekiwaniu na potwierdzenie", description: "Zamówienie oczekuje na potwierdzenie przez sprzedawcę." },
  { name: "W realizacji", description: "Zamówienie jest w trakcie realizacji." },
  { name: "Wysłane", description: "Zamówienie zostało wysłane." },
  { name: "Dostarczone", description: "Zamówienie zostało dostarczone." },
  { name: "Anulowane", description: "Zamówienie zostało anulowane." },
  { name: "Zakończone", description: "Zamówienie zostało zakończone." },
];

function OrderStatusesInfo() {
  return (
    <Box
      component="section"
      aria-labelledby="order-statuses-heading"
      sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3 } })}>
      <Typography component="h2" id="order-statuses-heading" sx={{ ...sectionHeadingSx, mb: 0 }}>
        Statusy zamówień
      </Typography>
      <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: "0.9rem", lineHeight: 1.55, maxWidth: "60ch" }}>
        Jak czytać etapy realizacji Twojego zamówienia.
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
            key={status.name}
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
                {status.name}
              </Typography>
              <Typography
                component="dd"
                sx={{ m: 0, mt: 0.25, color: "text.secondary", fontSize: "0.88rem", lineHeight: 1.5 }}>
                {status.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default OrderStatusesInfo;

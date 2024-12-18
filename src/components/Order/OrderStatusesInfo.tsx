import { Box, Typography } from "@mui/material";

function OrderStatusesInfo() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "4px",
        border: "1px solid",
        borderColor: "text.primary",
        borderRadius: 1,
        padding: "16px",
        mt: 2,
      }}
    >
      <Typography
        variant={"h5"}
        sx={{
          fontWeight: "bold",
        }}
      >
        Statusy zamówień:
      </Typography>
      <Typography
        variant={"h6"}
        sx={{
          fontWeight: "bold",
        }}
      >
        Nowe
      </Typography>
      <Typography variant={"body2"}>
        Zamówienie nie zostało jeszcze potwierdzone i proces realizacji jeszcze
        się nie rozpoczął.
      </Typography>
      <Typography
        variant={"h6"}
        sx={{
          fontWeight: "bold",
        }}
      >
        W oczekiwaniu na płatność
      </Typography>
      <Typography variant={"body2"}>
        Zamówienie oczekuje na potwierdzenie płatności.
      </Typography>
      <Typography
        variant={"h6"}
        sx={{
          fontWeight: "bold",
        }}
      >
        W oczekiwaniu na potwierdzenie
      </Typography>
      <Typography variant={"body2"}>
        Zamówienie oczekuje na potwierdzenie przez sprzedawcę.
      </Typography>
      <Typography
        variant={"h6"}
        sx={{
          fontWeight: "bold",
        }}
      >
        W realizacji
      </Typography>
      <Typography variant={"body2"}>
        Zamówienie jest w trakcie realizacji.
      </Typography>
      <Typography
        variant={"h6"}
        sx={{
          fontWeight: "bold",
        }}
      >
        Wysłane
      </Typography>
      <Typography variant={"body2"}>Zamówienie zostało wysłane.</Typography>
      <Typography
        variant={"h6"}
        sx={{
          fontWeight: "bold",
        }}
      >
        Dostarczone
      </Typography>
      <Typography variant={"body2"}>Zamówienie zostało dostarczone.</Typography>
      <Typography
        variant={"h6"}
        sx={{
          fontWeight: "bold",
        }}
      >
        Anulowane
      </Typography>
      <Typography variant={"body2"}>Zamówienie zostało anulowane.</Typography>
      <Typography variant={"h6"} sx={{ fontWeight: "bold" }}>
        Zakończone
      </Typography>
      <Typography variant={"body2"}>Zamówienie zostało zakończone.</Typography>
    </Box>
  );
}

export default OrderStatusesInfo;

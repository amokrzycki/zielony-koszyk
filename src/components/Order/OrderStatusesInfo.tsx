import { Box, Typography } from "@mui/material";

function OrderStatusesInfo() {
  return (
    <Box
      className={"flex flex-col items-start gap-4 border rounded p-4 mt-4"}
      sx={{
        borderColor: "background.default",
      }}
    >
      <Typography variant={"h5"} className={"font-bold"}>
        Statusy zamówień:
      </Typography>
      <Typography variant={"h6"} className={"font-bold"}>
        Nowe
      </Typography>
      <Typography variant={"body2"}>
        Zamówienie nie zostało jeszcze potwierdzone i proces realizacji jeszcze
        się nie rozpoczął.
      </Typography>
      <Typography variant={"h6"} className={"font-bold"}>
        W oczekiwaniu na płatność
      </Typography>
      <Typography variant={"body2"}>
        Zamówienie oczekuje na potwierdzenie płatności.
      </Typography>
      <Typography variant={"h6"} className={"font-bold"}>
        W oczekiwaniu na potwierdzenie
      </Typography>
      <Typography variant={"body2"}>
        Zamówienie oczekuje na potwierdzenie przez sprzedawcę.
      </Typography>
      <Typography variant={"h6"} className={"font-bold"}>
        W realizacji
      </Typography>
      <Typography variant={"body2"}>
        Zamówienie jest w trakcie realizacji.
      </Typography>
      <Typography variant={"h6"} className={"font-bold"}>
        Wysłane
      </Typography>
      <Typography variant={"body2"}>Zamówienie zostało wysłane.</Typography>
      <Typography variant={"h6"} className={"font-bold"}>
        Dostarczone
      </Typography>
      <Typography variant={"body2"}>Zamówienie zostało dostarczone.</Typography>
      <Typography variant={"h6"} className={"font-bold"}>
        Anulowane
      </Typography>
      <Typography variant={"body2"}>Zamówienie zostało anulowane.</Typography>
      <Typography variant={"h6"} className={"font-bold"}>
        Zakończone
      </Typography>
      <Typography variant={"body2"}>Zamówienie zostało zakończone.</Typography>
    </Box>
  );
}

export default OrderStatusesInfo;

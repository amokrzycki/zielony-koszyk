import { Box, Button, Typography } from "@mui/material";

function OrderNoAccount() {
  return (
    <Box
      sx={{
        flex: "0 0 33.333333%",
        maxWidth: "33.333333%",
        textAlign: "center",
      }}
    >
      <Box id="login-wrapper">
        <Typography variant={"h4"} gutterBottom>
          Nie mam konta
        </Typography>
        <Box>
          <Button variant="contained" color="primary" href="/zamowienie">
            Kup bez rejestracji
          </Button>
          <Typography variant={"h6"} gutterBottom>
            lub
          </Typography>
          <Button variant="contained" color="primary" href="/rejestracja">
            Utwórz konto
          </Button>
          <Box
            className="account-notice"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant={"body2"} gutterBottom>
              Zakładając konto, będziesz mógł dokonywać zakupów szybciej, być na
              bieżąco z statusami zamówień oraz śledzić historię swoich zakupów.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderNoAccount;

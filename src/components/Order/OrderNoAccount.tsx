import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function OrderNoAccount() {
  const navigate = useNavigate();
  return (
    <Box
      className={"max-w-1/3 text-center"}
      sx={{
        maxWidth: "33.333333%",
      }}
    >
      <Box id="login-wrapper">
        <Typography variant={"h4"} gutterBottom>
          Nie mam konta
        </Typography>
        <Box className={"flex flex-col gap-2 items-center mt-4"}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/zamowienie")}
          >
            Kup bez rejestracji
          </Button>
          <Typography variant={"h6"}>lub</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/login?tab=1")}
          >
            Utwórz konto
          </Button>
          <Box className="account-notice flex flex-col items-center">
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

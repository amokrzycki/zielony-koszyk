import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AccountOptions() {
  const navigate = useNavigate();

  // TODO: Add more password and email change options

  return (
    <Box>
      <Box>
        <Typography variant="h4">Twoje konto</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          mt: "1rem",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/konto/zamowienia");
          }}
        >
          Twoje zamówienia
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/konto/zmiana-email");
          }}
        >
          Zmiana adresu email
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            navigate("/konto/zmiana-hasla");
          }}
        >
          Zmiana hasła
        </Button>
      </Box>
    </Box>
  );
}

export default AccountOptions;

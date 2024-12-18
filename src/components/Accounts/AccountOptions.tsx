import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PasswordIcon from "@mui/icons-material/Password";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";

function AccountOptions() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography variant="h4">Twoje konto</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          mt: "1rem",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size={"large"}
          startIcon={<ImportContactsIcon sx={{ color: "text.primary" }} />}
          onClick={() => {
            navigate("/konto/ksiazka-adresowa");
          }}
        >
          Ksiązka adresowa
        </Button>
        <Button
          variant="contained"
          color="primary"
          size={"large"}
          startIcon={<ShoppingBagIcon sx={{ color: "text.primary" }} />}
          onClick={() => {
            navigate("/konto/zamowienia");
          }}
        >
          Twoje zamówienia
        </Button>
        <Button
          variant="contained"
          color="primary"
          size={"large"}
          startIcon={<AlternateEmailIcon sx={{ color: "text.primary" }} />}
          onClick={() => {
            navigate("/konto/zmiana-email");
          }}
        >
          Zmiana adresu email
        </Button>
        <Button
          variant="contained"
          color="primary"
          size={"large"}
          startIcon={<PasswordIcon sx={{ color: "text.primary" }} />}
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

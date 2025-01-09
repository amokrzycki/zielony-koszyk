import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PasswordIcon from "@mui/icons-material/Password";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import BuildIcon from "@mui/icons-material/Build";
import { Roles } from "../../enums/Roles.ts";
import User from "../../types/User.ts";
import { useAppSelector } from "../../hooks/hooks.ts";
import { RootState } from "../../store/store.ts";

function AccountOptions() {
  const navigate = useNavigate();
  const user: User = useAppSelector((state: RootState) => state.auth.user);

  return (
    <Box className={"flex flex-col items-center"}>
      <Box>
        <Typography variant="h4">Twoje konto</Typography>
      </Box>
      <Box className={"flex justify-center gap-4 mt-4"}>
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
        {user.role === Roles.ADMIN && (
          <Button
            variant="contained"
            color="primary"
            size={"large"}
            startIcon={<BuildIcon sx={{ color: "text.primary" }} />}
            onClick={() => {
              navigate("/admin");
            }}
          >
            Panel administratora
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default AccountOptions;

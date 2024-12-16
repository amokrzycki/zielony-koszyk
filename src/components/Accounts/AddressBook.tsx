import { useAppSelector } from "../../hooks/hooks.ts";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import User from "../../types/User.ts";

function AddressBook() {
  const user: User = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleEditData = () => {
    navigate("/konto/ksiazka-adresowa/edytuj-dane");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant={"h4"} gutterBottom>
        Dane do rachunku
      </Typography>
      <Box
        sx={{
          marginBottom: "1rem",
          padding: "2rem",
          border: "1px solid #ccc",
          borderRadius: "5px",
          maxWidth: "400px",
        }}
      >
        <Typography variant={"h5"} gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography>Telefon: {user.phone}</Typography>
        <Typography>
          {user.street} {user.building_number}
        </Typography>
        <Typography>
          {user.zip}, {user.city}
        </Typography>
        <Button
          onClick={handleEditData}
          variant={"contained"}
          sx={{
            mt: 1,
          }}
        >
          Edytuj dane
        </Button>
      </Box>
      <Typography variant={"h4"} gutterBottom>
        Adres dostawy
      </Typography>
      <Box
        sx={{
          marginBottom: "1rem",
          padding: "2rem",
          border: "1px solid #ccc",
          borderRadius: "5px",
          maxWidth: "400px",
        }}
      >
        <Typography variant={"h5"} gutterBottom>
          {user.first_name} {user.last_name}
        </Typography>
        <Typography>Telefon: {user.phone}</Typography>
        <Typography>
          {user.street} {user.building_number}
        </Typography>
        <Typography>
          {user.zip}, {user.city}
        </Typography>
        <Button
          onClick={handleEditData}
          variant={"contained"}
          sx={{
            mt: 1,
          }}
        >
          Edytuj dane
        </Button>
      </Box>
    </Box>
  );
}

export default AddressBook;

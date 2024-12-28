import { Box, Typography } from "@mui/material";

function AdminWelcomeMessage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dzień dobry!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Witaj w panelu administracyjnym sklepu internetowego „Zielony Koszyk”. W
        menu po lewej stronie znajdziesz listę dostępnych opcji, które umożliwią
        Ci zarządzanie sklepem.
      </Typography>
    </Box>
  );
}

export default AdminWelcomeMessage;

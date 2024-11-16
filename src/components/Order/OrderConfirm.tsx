import { Box, Typography } from "@mui/material";

function OrderConfirm() {
  return (
    <Box id="main-wrapper">
      <Box
        className="main-container"
        sx={{
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Dziękujemy za złożenie zamówienia!
        </Typography>
        <Typography variant="h5" gutterBottom>
          Otrzymasz potwierdzenie zamówienia na adres email.
        </Typography>
      </Box>
    </Box>
  );
}

export default OrderConfirm;

import { Box, Button, Typography } from "@mui/material";
import OrderNoAccount from "../Order/OrderNoAccount.tsx";
import LoginForm from "../Accounts/LoginForm.tsx";

function CartLogin() {
  return (
    <Box id="main-wrapper">
      <Box
        className="main-container"
        sx={{
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box className="main-container">
          <Box>
            <img src="logo.png" alt="logo" height="120px" />
          </Box>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  flex: "0 0 33.333333%",
                  maxWidth: "33.333333%",
                }}
              >
                <Typography variant={"h4"} gutterBottom>
                  Mam konto
                </Typography>
                <LoginForm />
              </Box>
              <Box
                className="separator"
                sx={{
                  position: "relative",
                  flex: "0 0 8.33333%",
                  maxWidth: "8.333333333%",
                }}
              >
                <Box>xd</Box>
              </Box>
              <OrderNoAccount />
            </Box>
          </Box>
        </Box>
        <Box className="main-container">
          <Box sx={{ marginBottom: "30px" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <Box
                sx={{
                  flex: "0 0 33.333333%",
                  maxWidth: "33.333333%",
                }}
              >
                <Button variant="contained" color="primary" href="/koszyk">
                  Wróć do koszyka
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CartLogin;

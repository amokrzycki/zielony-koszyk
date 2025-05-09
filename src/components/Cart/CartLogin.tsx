import { Box, Button, Typography } from "@mui/material";
import OrderNoAccount from "../Order/OrderNoAccount.tsx";
import LoginForm from "../Accounts/LoginForm.tsx";
import { useNavigate } from "react-router-dom";
import { useMode } from "@/providers/ModeProvider.tsx";
import Divider from "@mui/material/Divider";

function CartLogin() {
  const navigate = useNavigate();
  const { mode } = useMode();
  return (
    <Box id="main-wrapper">
      <Box
        className="main-container"
        sx={{
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box className="main-container flex flex-col items-center">
          <Box>
            <img src={`/${mode}_logo.png`} alt="logo" className={"h-[120px]"} />
          </Box>
          <Box>
            <Box className={"flex flex-wrap justify-center"}>
              <Box
                className={"max-w-1/3"}
                sx={{
                  flex: "0 0 33.333333%",
                }}
              >
                <Typography variant={"h4"} gutterBottom>
                  Mam konto
                </Typography>
                <LoginForm />
              </Box>
              <Box
                className={"separator flex justify-center"}
                sx={{
                  flex: "0 0 8.33333%",
                }}
              >
                <Divider orientation="vertical" flexItem />
              </Box>
              <OrderNoAccount />
            </Box>
          </Box>
        </Box>
        <Box className="main-container">
          <Box sx={{ marginBottom: "30px" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              <Box
                className={"max-w-1/3"}
                sx={{
                  flex: "0 0 33.333333%",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
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

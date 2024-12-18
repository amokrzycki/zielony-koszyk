import { Box, Button, Typography } from "@mui/material";
import AutoBreadcrumbs from "../AutoBreadcrumbs.tsx";
import { Outlet, useNavigate } from "react-router-dom";
import User from "../../types/User.ts";
import { useAppSelector } from "../../hooks/hooks.ts";
import { RootState } from "../../store/store.ts";

function AccountView() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  if (Object.keys(user).length === 0) {
    return (
      <Box id="main-wrapper">
        <Box
          className="main-container"
          sx={{
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <Box className="main-container" sx={{ mt: 0 }}>
            <Typography variant="h4" gutterBottom>
              Zaloguj się, aby zobaczyć swoje konto
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                navigate("/login");
              }}
            >
              Zaloguj się
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box id="main-wrapper">
      <Box
        className="main-container"
        sx={{
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Box className="main-container" sx={{ mt: 0 }}>
          <AutoBreadcrumbs />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AccountView;

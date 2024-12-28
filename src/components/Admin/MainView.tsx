import { Box, Button, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "./Navigation.tsx";
import { useAppSelector } from "../../hooks/hooks.ts";
import { RootState } from "../../store/store.ts";
import AutoBreadcrumbs from "../AutoBreadcrumbs.tsx";

function MainView() {
  const user = useAppSelector((state: RootState) => state.auth.user);
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
              Zaloguj się, aby uruchomić panel administracyjny
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
        className={"main-container"}
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <Box className={"main-container"} sx={{ mt: 0 }}>
          <AutoBreadcrumbs />
          <Box id={"view-wrapper"} className={"mt-4 flex gap-4 w-full"}>
            <Navigation />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MainView;

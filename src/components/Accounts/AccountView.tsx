import { Box } from "@mui/material";
import Breadcumbs from "../Breadcumbs.tsx";
import { Outlet } from "react-router-dom";

function AccountView() {
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
          <Breadcumbs />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AccountView;

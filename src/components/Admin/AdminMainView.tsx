import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AutoBreadcrumbs from "../../../../admin-panel/src/components/AutoBreadcrumbs.tsx";
import AdminNavigation from "./AdminNavigation.tsx";

function AdminMainView() {
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
            <AdminNavigation />
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminMainView;

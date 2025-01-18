import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import StoreIcon from "@mui/icons-material/Store";

function Nav() {
  const navigate = useNavigate();
  return (
    <Box
      id="navigation-wrapper"
      className={"gap-2 items-center flex justify-center"}
    >
      <Button
        color={"primary"}
        startIcon={<HomeIcon sx={{ color: "text.primary" }} />}
        sx={{ color: "text.primary" }}
        onClick={() => {
          navigate("/");
        }}
      >
        Strona główna
      </Button>
      <Button
        color={"primary"}
        startIcon={<InventoryIcon sx={{ color: "text.primary" }} />}
        sx={{ color: "text.primary" }}
        onClick={() => {
          navigate("/produkty");
        }}
      >
        Produkty
      </Button>
      <Button
        color={"primary"}
        startIcon={<StoreIcon sx={{ color: "text.primary" }} />}
        sx={{ color: "text.primary" }}
        onClick={() => {
          navigate("/o-nas");
        }}
      >
        O nas
      </Button>
    </Box>
  );
}

export default Nav;

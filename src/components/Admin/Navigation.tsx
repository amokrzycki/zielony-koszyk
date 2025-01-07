import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import GroupIcon from "@mui/icons-material/Group";
import SellIcon from "@mui/icons-material/Sell";
import SettingsIcon from "@mui/icons-material/Settings";

function Navigation() {
  const navigate = useNavigate();
  return (
    <Box className={"flex flex-col gap-4"}>
      <Button
        variant="contained"
        color="primary"
        size={"large"}
        startIcon={<Inventory2Icon sx={{ color: "text.primary" }} />}
        onClick={() => {
          navigate("/admin/zarzadzanie-produktami");
        }}
      >
        Produkty
      </Button>
      <Button
        variant="contained"
        color="primary"
        size={"large"}
        startIcon={<SellIcon sx={{ color: "text.primary" }} />}
        onClick={() => {
          navigate("/admin/zarzadzanie-zamowieniami");
        }}
      >
        Zamówienia
      </Button>
      <Button
        variant="contained"
        color="primary"
        size={"large"}
        startIcon={<GroupIcon sx={{ color: "text.primary" }} />}
        onClick={() => {
          navigate("/admin/zarzadzanie-uzytkownikami");
        }}
      >
        Użytkownicy
      </Button>
      <Button
        variant="contained"
        color="primary"
        size={"large"}
        startIcon={<SettingsIcon sx={{ color: "text.primary" }} />}
        onClick={() => {
          navigate("/admin/ustawienia");
        }}
      >
        Ustawienia
      </Button>
    </Box>
  );
}

export default Navigation;

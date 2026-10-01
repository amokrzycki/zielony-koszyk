import { Box, Divider, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Nav from "./Nav.tsx";
import CartBadge from "./Cart/CartBadge.tsx";
import UserBadge from "./Accounts/UserBadge.tsx";

interface MobileMenuProps {
  open: boolean;
  mode: string;
  onClose: () => void;
}

function MobileMenu({ open, mode, onClose }: MobileMenuProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-label="Menu"
      PaperProps={{
        sx: {
          width: { xs: "min(88vw, 340px)", sm: 380 },
          p: 2,
          bgcolor: "background.paper",
          backgroundImage: "none",
        },
      }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Box component="img" src={`/${mode}_logo.png`} alt="Zielony koszyk" sx={{ height: 34, width: "auto" }} />
        <IconButton onClick={onClose} aria-label="Zamknij menu">
          <CloseIcon />
        </IconButton>
      </Box>
      <Nav vertical onNavigate={onClose} />
      <Divider sx={{ my: 2 }} />
      <CartBadge variant="drawer" onNavigate={onClose} />
      <Divider sx={{ my: 2 }} />
      <UserBadge variant="drawer" onNavigate={onClose} />
    </Drawer>
  );
}

export default MobileMenu;

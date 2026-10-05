import { Box, Divider, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import Nav from "./Nav.tsx";
import LanguageSwitcher from "./LanguageSwitcher.tsx";
import CartBadge from "./Cart/CartBadge.tsx";
import UserBadge from "./Accounts/UserBadge.tsx";

interface MobileMenuProps {
  open: boolean;
  mode: string;
  onClose: () => void;
}

function MobileMenu({ open, mode, onClose }: MobileMenuProps) {
  const { t } = useTranslation();
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-label={t("nav.menu")}
      id="mobile-menu"
      PaperProps={{
        sx: {
          width: { xs: "min(88vw, 340px)", sm: 380 },
          p: 2,
          bgcolor: "background.paper",
          backgroundImage: "none",
        },
      }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}>
        <Box component="img" src={`/${mode}_logo.png`} alt={t("app.name")} sx={{ height: 34, width: "auto" }} />
        <IconButton onClick={onClose} aria-label={t("nav.closeMenu")}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Nav vertical onNavigate={onClose} />
      <Divider sx={{ my: 2 }} />
      <CartBadge variant="drawer" onNavigate={onClose} />
      <Divider sx={{ my: 2 }} />
      <UserBadge variant="drawer" onNavigate={onClose} />
      <Divider sx={{ my: 2 }} />
      <LanguageSwitcher onSelect={onClose} />
    </Drawer>
  );
}

export default MobileMenu;

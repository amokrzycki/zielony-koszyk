import { Badge, Box, Button, useTheme } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { navPillSx, navRowSx } from "../navStyles.ts";

interface CartBadgeProps {
  variant?: "bar" | "drawer";
  onNavigate?: () => void;
}

function CartBadge({ variant = "bar", onNavigate }: CartBadgeProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = pathname === "/koszyk";
  const cartItemCounts = useSelector((state: RootState) => state.cart.items.length);

  const handleClick = () => {
    onNavigate?.();
    navigate("/koszyk");
  };

  const icon = (
    <Badge badgeContent={cartItemCounts} color="primary" max={99}>
      <ShoppingCartIcon fontSize="small" />
    </Badge>
  );

  if (variant === "drawer") {
    return (
      <Button onClick={handleClick} startIcon={icon} className={isActive ? "active" : undefined} sx={navRowSx(theme)}>
        Mój koszyk{cartItemCounts > 0 ? ` (${cartItemCounts})` : ""}
      </Button>
    );
  }

  return (
    <Button
      id="cart-button"
      onClick={handleClick}
      startIcon={icon}
      className={isActive ? "active" : undefined}
      aria-label="Mój koszyk"
      sx={navPillSx(theme)}>
      <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
        Mój koszyk
      </Box>
    </Button>
  );
}

export default CartBadge;

import { useEffect, useRef } from "react";
import { Badge, Box, Button, useTheme } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "@/i18n/useLocale.ts";
import { navPillSx, navRowSx } from "../navStyles.ts";
import { EASE } from "../listingStyles.ts";

interface CartBadgeProps {
  variant?: "bar" | "drawer";
  onNavigate?: () => void;
}

function CartBadge({ variant = "bar", onNavigate }: CartBadgeProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation("checkout");
  const to = useLocalePath();
  const isActive = pathname === to("cart");
  const cartItemCounts = useSelector((state: RootState) => state.cart.items.length);

  // A short pulse when the count changes, so an add-to-cart is visible in the header. Skips first render.
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(cartItemCounts);
  useEffect(() => {
    if (cartItemCounts > prevCount.current) {
      badgeRef.current
        ?.querySelector(".MuiBadge-badge")
        ?.animate(
          [
            { transform: "scale(1) translate(50%, -50%)" },
            { transform: "scale(1.25) translate(50%, -50%)" },
            { transform: "scale(1) translate(50%, -50%)" },
          ],
          {
            duration: 300,
            easing: EASE,
          },
        );
    }
    prevCount.current = cartItemCounts;
  }, [cartItemCounts]);

  const handleClick = () => {
    onNavigate?.();
    navigate(to("cart"));
  };

  const icon = (
    <Badge ref={badgeRef} badgeContent={cartItemCounts} color="primary" max={99}>
      <ShoppingCartIcon fontSize="small" />
    </Badge>
  );

  if (variant === "drawer") {
    return (
      <Button onClick={handleClick} startIcon={icon} className={isActive ? "active" : undefined} sx={navRowSx(theme)}>
        {t("badge.label")}
        {cartItemCounts > 0 ? ` (${cartItemCounts})` : ""}
      </Button>
    );
  }

  return (
    <Button
      id="cart-button"
      onClick={handleClick}
      startIcon={icon}
      className={isActive ? "active" : undefined}
      aria-label={t("badge.label")}
      sx={navPillSx(theme)}>
      <Box component="span" sx={{ display: { xs: "none", lg: "inline" } }}>
        {t("badge.label")}
      </Box>
    </Button>
  );
}

export default CartBadge;

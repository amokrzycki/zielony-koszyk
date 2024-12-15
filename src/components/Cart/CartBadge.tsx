import { Badge, BadgeProps, IconButton, styled } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";

function CartBadge() {
  const cartItemCounts = useSelector(
    (state: RootState) => state.cart.items.length,
  );

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const handleClick = () => {
    window.location.href = "/koszyk";
  };

  return (
    <IconButton aria-label="cart" onClick={handleClick} sx={{ mr: 0.5 }}>
      <StyledBadge badgeContent={cartItemCounts} color="secondary">
        <ShoppingCartIcon sx={{ color: "text.primary" }} />
      </StyledBadge>
    </IconButton>
  );
}

export default CartBadge;

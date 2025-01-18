import { Badge, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import { useNavigate } from "react-router-dom";

function CartBadge() {
  const navigate = useNavigate();
  const cartItemCounts = useSelector(
    (state: RootState) => state.cart.items.length,
  );

  const handleClick = () => {
    navigate("/koszyk");
  };

  return (
    <Button
      id="cart-button"
      size={"large"}
      onClick={handleClick}
      sx={{ color: "text.primary" }}
    >
      <Badge badgeContent={cartItemCounts} color="info" sx={{ mr: 2 }}>
        <ShoppingCartIcon />
      </Badge>
      Mój koszyk
    </Button>
  );
}

export default CartBadge;

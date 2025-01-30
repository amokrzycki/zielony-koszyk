import { Typography } from "@mui/material";
import CartItem from "@/types/CartItem.ts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store.ts";

function CartSummary() {
  const cart = useSelector((state: RootState) => state.cart.items);
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Podsumowanie zamówienia
      </Typography>
      <Typography variant="h6" gutterBottom>
        Produkty:
      </Typography>
      {cart.map((item: CartItem) => (
        <Typography key={item.productId} variant="body1">
          {item.quantity} x {item.name} - {item.price} zł
        </Typography>
      ))}
      <Typography variant="h6" gutterBottom>
        Suma:{" "}
        {cart.reduce(
          (acc: number, item: CartItem) => acc + item.quantity * item.price,
          0,
        )}{" "}
        zł
      </Typography>
      <Typography variant="h6" gutterBottom>
        Dostawa: 10 zł
      </Typography>
      <Typography variant="h6" gutterBottom>
        Razem:{" "}
        {cart.reduce(
          (acc: number, item: CartItem) => acc + item.quantity * item.price,
          0,
        ) + 10}{" "}
        zł
      </Typography>
    </>
  );
}

export default CartSummary;

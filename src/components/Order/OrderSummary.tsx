import { useAppDispatch, useAppSelector } from "../../hooks/hooks.ts";
import { Box, Button, FormControlLabel, Typography } from "@mui/material";
import CartItem from "../../types/CartItem.ts";
import { Order } from "../../types/Order.ts";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useCreateOrderMutation } from "./orderApiSlice.ts";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../Cart/cartSlice.ts";
import { clearOrder } from "./orderSlice.ts";

function OrderSummary() {
  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orderInfo: Order = useAppSelector((state) => state.order.orderInfo);
  const cart = useAppSelector((state) => state.cart);
  const cartItems = cart.items;
  const [createOrder] = useCreateOrderMutation();

  const handleOrder = () => {
    createOrder(orderInfo);
    dispatch(clearCart());
    dispatch(clearOrder());
    navigate("/zamowienie/potwierdzenie");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        padding: "1rem",
        justifyContent: "center",
      }}
      id="main-wrapper"
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "5px",
        }}
      >
        <Box
          sx={{
            padding: "1rem",
          }}
        >
          <Typography variant="h5">Dane zamawiającego:</Typography>
          <Typography>{orderInfo.customer_name}</Typography>
          <Typography>{orderInfo.customer_email}</Typography>
          <Typography>telefon: {orderInfo.customer_phone}</Typography>
          <Typography>e-mail: {orderInfo.customer_email}</Typography>
          <Typography>adres: {orderInfo.customer_address}</Typography>
          <Typography variant="h5">Zamówione produkty:</Typography>
          <ul>
            {cartItems.map((item: CartItem) => (
              <li key={item.productId}>
                {item.name} x {item.quantity} - {item.price * item.quantity} zł
              </li>
            ))}
          </ul>
        </Box>
      </Box>
      <Box
        sx={{
          bgcolor: "background.paper",
          padding: "1rem",
          borderRadius: "5px",
          minWidth: "300px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          id="summary-box"
          sx={{
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Do zapłaty: </Typography>
          <Typography variant="h4">{cart.totalAmount} zł</Typography>
        </Box>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={() => setChecked((prev) => !prev)}
              />
            }
            label="Zapoznałem się z regulaminem i akceptuję jego warunki"
          />
        </Box>
        <Button
          variant={"contained"}
          color={"primary"}
          fullWidth
          sx={{
            justifySelf: "flex-end",
          }}
          disabled={!checked}
          onClick={handleOrder}
        >
          Zamarwiam i płacę
        </Button>
        <Typography variant="caption" sx={{ marginTop: "1rem" }}>
          Umowa sprzedaży zostanie zawarta dopiero po potwierdzeniu zamówienia
          do realizacji przez Sprzedawcę.
        </Typography>
      </Box>
    </Box>
  );
}

export default OrderSummary;

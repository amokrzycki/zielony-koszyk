import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { Box, Button, FormControlLabel, Typography } from "@mui/material";
import CartItem from "../../types/CartItem.ts";
import { CreateOrderDTO } from "@/types/CreateOrderDTO.ts";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useCreateOrderMutation } from "./orderApiSlice.ts";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../Cart/cartSlice.ts";
import { clearOrder } from "./orderSlice.ts";
import toast from "react-hot-toast";

function OrderSummary() {
  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orderInfo: CreateOrderDTO = useAppSelector(
    (state) => state.order.orderInfo,
  );
  const cart = useAppSelector((state) => state.cart);
  const cartItems = cart.items;
  const [createOrder] = useCreateOrderMutation();

  const handleOrder = () => {
    toast
      .promise(createOrder(orderInfo).unwrap(), {
        loading: "Trwa składanie zamówienia...",
        success: "Zamówienie złożone pomyślnie!",
        error: "Wystąpił błąd podczas składania zamówienia",
      })
      .then(() => {
        dispatch(clearCart());
        dispatch(clearOrder());
        navigate("/zamowienie/potwierdzenie");
      });
  };

  return (
    <Box className={"flex flex-row gap-4 p-4 justify-center"} id="main-wrapper">
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "5px",
        }}
      >
        <Box className={"p-4"}>
          <Typography variant="h5">Dane do dostawy:</Typography>
          <Typography>
            {orderInfo.shipping_address.first_name}{" "}
            {orderInfo.shipping_address.last_name}
          </Typography>
          {orderInfo.order_type === "COMPANY" && (
            <Typography>NIP: {orderInfo.nip}</Typography>
          )}
          <Typography>Telefon: {orderInfo.shipping_address.phone}</Typography>
          <Typography>E-mail: {orderInfo.customer_email}</Typography>
          <Typography>
            Adres: {`${orderInfo.shipping_address.street}`}
          </Typography>
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
        className={"p-4 flex flex-col m-w-[300px] rounded"}
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <Box id="summary-box" className={"flex flex-row justify-between"}>
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
          className={"justify-end"}
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

import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { Box, Button, FormControlLabel, Typography } from "@mui/material";
import CartItem from "../../types/CartItem.ts";
import { CreateOrder } from "@/types/CreateOrder.ts";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useCreateOrderMutation } from "./orderApiSlice.ts";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../Cart/cartSlice.ts";
import { clearOrder } from "./orderSlice.ts";
import toast from "react-hot-toast";
import { RootState } from "@/store/store.ts";
import { CartState } from "@/reducers/cartReducers.ts";
import { OrderType } from "@/enums/OrderType.ts";
import ErrorView from "@/components/common/ErrorView.tsx";

function OrderSummary() {
  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orderInfo: CreateOrder = useAppSelector(
    (state) => state.order.orderInfo,
  );
  const cart: CartState = useAppSelector((state: RootState) => state.cart);
  const cartItems = cart.items;
  const [createOrder] = useCreateOrderMutation();

  if (!orderInfo.customer_email || !cartItems) {
    return (
      <Box id="main-main-wrapper">
        <Box className={"main-container"}>
          <Box
            className={"main-container"}
            sx={{
              bgcolor: "background.paper",
            }}
          >
            <ErrorView
              message={"Brak danych zamówienia"}
              errorText={
                "Nie udało się pobrać danych zamówienia. Przejdź proszę do koszyka i spróbuj ponownie."
              }
            />
          </Box>
        </Box>
      </Box>
    );
  }

  const createOrderItems = () => {
    return cart.items.map((item: CartItem) => ({
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
  };

  const handleOrder = () => {
    const order: CreateOrder = {
      ...orderInfo,
      orderItems: createOrderItems(),
    };
    toast
      .promise(createOrder(order).unwrap(), {
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
            {orderInfo.shippingAddress.first_name}{" "}
            {orderInfo.shippingAddress.last_name}
          </Typography>
          {orderInfo.order_type === OrderType.COMPANY && (
            <>
              <Typography>
                Firma: {orderInfo.shippingAddress.company_name}
              </Typography>
              <Typography>NIP: {orderInfo.shippingAddress.nip}</Typography>
            </>
          )}
          <Typography>Telefon: {orderInfo.shippingAddress.phone}</Typography>
          <Typography>E-mail: {orderInfo.customer_email}</Typography>
          <Typography>
            Adres: {`${orderInfo.shippingAddress.street}`}
          </Typography>
          <Typography variant="h5">Dane do faktury:</Typography>
          {orderInfo.same_address ? (
            <Typography>Takie same jak do wysyłki</Typography>
          ) : (
            <>
              <Typography>
                {orderInfo.billingAddress.first_name}{" "}
                {orderInfo.billingAddress.last_name}
              </Typography>
              {orderInfo.order_type === OrderType.COMPANY && (
                <>
                  <Typography>
                    Firma: {orderInfo.billingAddress.company_name}
                  </Typography>
                  <Typography>NIP: {orderInfo.billingAddress.nip}</Typography>
                </>
              )}
              <Typography>Telefon: {orderInfo.billingAddress.phone}</Typography>
              <Typography>E-mail: {orderInfo.customer_email}</Typography>
              <Typography>
                Adres: {`${orderInfo.billingAddress.street}`}
              </Typography>
            </>
          )}
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
          Zamawiam i płacę
        </Button>
        <Typography variant="caption" sx={{ marginTop: "1rem" }}>
          Umowa sprzedaży zostanie zawarta dopiero po potwierdzeniu zamówienia
          do realizacji przez Sprzedawcę.
        </Typography>
        <Button
          variant={"outlined"}
          color={"primary"}
          fullWidth
          className={"justify-end"}
          onClick={() => navigate("/zamowienie")}
          sx={{ marginTop: "1rem" }}
        >
          Wróć do poprzedniej strony
        </Button>
      </Box>
    </Box>
  );
}

export default OrderSummary;

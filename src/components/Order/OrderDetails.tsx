import { Box, Button, FormControlLabel, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store.ts";
import CartItem from "@/types/CartItem.ts";
import OrderForm from "@/components/Order/OrderForm.tsx";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { CreateOrderDTO } from "@/types/CreateOrderDTO.ts";

function OrderDetails() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const orderInfo: CreateOrderDTO = useSelector(
    (state: RootState) => state.order.orderInfo,
  );
  const [useDifferentAddress, setUseDifferentAddress] = useState(false);

  // TODO: after 4h I failed, will figure out this tomorrow

  return (
    <Box id="main-wrapper">
      <Box
        className="main-container flex items-center justify-around flex-col"
        sx={{
          bgcolor: "background.paper",
        }}
      >
        <Box className={"main-container"}>
          <Grid container className={"w-full justify-around"}>
            <Grid>
              <OrderForm address={orderInfo.shipping_address} />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useDifferentAddress}
                    onChange={() => setUseDifferentAddress((prev) => !prev)}
                  />
                }
                label={"Chcę otrzymać fakturę na inne dane"}
              />
              {useDifferentAddress && (
                <OrderForm address={orderInfo.billing_address} />
              )}
            </Grid>
            <Grid>
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
                  (acc: number, item: CartItem) =>
                    acc + item.quantity * item.price,
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
                  (acc: number, item: CartItem) =>
                    acc + item.quantity * item.price,
                  0,
                ) + 10}{" "}
                zł
              </Typography>
              <Button type="submit" variant="contained">
                Przejdź dalej
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderDetails;

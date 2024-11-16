import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import OrderForm from "./OrderForm.tsx";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store.ts";
import CartItem from "../../types/CartItem.ts";

function OrderDetails() {
  const cart = useSelector((state: RootState) => state.cart.items);

  return (
    <Box id="main-wrapper">
      <Box
        className="main-container"
        sx={{
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "column",
        }}
      >
        <Grid
          container
          sx={{
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <Grid>
            <OrderForm />
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
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default OrderDetails;

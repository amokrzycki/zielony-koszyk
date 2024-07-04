import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store.ts";
import { changeQuantity, removeItem } from "../store/appSlice.ts";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CartItem from "../types/CartItem.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";

function Cart() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <Box
      id="main-wrapper"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        {cart.length === 0 ? "Twój koszyk jest pusty" : "Twój koszyk"}
      </Typography>
      {cart.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="cart-table">
              <TableHead>
                <TableRow>
                  <TableCell>Produkt</TableCell>
                  <TableCell align="left">Ilość</TableCell>
                  <TableCell align="right">Cena</TableCell>
                  <TableCell align="center">Kwota</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item: CartItem) => (
                  <TableRow key={item.productId}>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell align="left" width="80">
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          dispatch(
                            changeQuantity({
                              productId: item.productId,
                              quantity: parseInt(e.target.value),
                            }),
                          )
                        }
                        inputProps={{ min: 1 }}
                        size={"small"}
                        sx={{ width: 80 }}
                      />
                    </TableCell>
                    <TableCell align="right">{item.price}zł</TableCell>
                    <TableCell align="center">
                      {item.quantity * item.price}zł
                    </TableCell>
                    <TableCell align="right" width="50">
                      <Button
                        onClick={() => dispatch(removeItem(item.productId))}
                        startIcon={<DeleteIcon sx={{ color: "#FFF" }} />}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            id="summary-wrapper"
            sx={{
              display: "flex",
              width: "100vw",
              justifyContent: "flex-end",
              marginRight: "2em",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                padding: "2em",
                borderRadius: "1em",
                marginTop: "2em",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
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
              <Divider />
              <Typography variant="h6" gutterBottom>
                Razem:{" "}
                {cart.reduce(
                  (acc: number, item: CartItem) =>
                    acc + item.quantity * item.price,
                  0,
                ) + 10}{" "}
                zł
              </Typography>
              <Button variant="contained" color="primary">
                Idź do kasy
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default Cart;

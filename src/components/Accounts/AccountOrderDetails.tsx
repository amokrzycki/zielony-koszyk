import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../Order/orderApiSlice.ts";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { OrderDetailsResponse } from "../../types/OrderDetailsResponse.ts";

function AccountOrderDetails() {
  const { orderId } = useParams();
  const orderDetails = useGetOrderDetailsQuery(orderId as string);

  if (orderDetails.isLoading) {
    return <CircularProgress />;
  }

  if (orderDetails.isError) {
    return <div>Wystąpił błąd!</div>;
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 2,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Produkt</TableCell>
            <TableCell align="right">Ilość</TableCell>
            <TableCell align="right">Cena</TableCell>
            <TableCell align="right">Kwota</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderDetails.data.map(
            (product: OrderDetailsResponse, index: number) => (
              <TableRow key={index}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">{product.price} zł</TableCell>
                <TableCell align="right">
                  {(product.quantity * parseFloat(product.price)).toFixed(2)} zł
                </TableCell>
              </TableRow>
            ),
          )}
          <TableRow>
            <TableCell colSpan={3} align="right">
              Łącznie:
            </TableCell>
            <TableCell align="right">
              {orderDetails.data
                .reduce(
                  (acc: number, product: OrderDetailsResponse) =>
                    acc + product.quantity * parseFloat(product.price),
                  0,
                )
                .toFixed(2)}{" "}
              zł
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AccountOrderDetails;

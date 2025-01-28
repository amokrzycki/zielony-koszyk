import { OrderItemResponse } from "@/types/OrderItemResponse.ts";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface OrderDetailsTableProps {
  orderDetails: OrderItemResponse[];
}

function OrderDetailsTable({ orderDetails }: OrderDetailsTableProps) {
  return (
    <TableContainer
      component={Paper}
      className={"mb-2 border border-t-0"}
      sx={{
        borderColor: "text.primary",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nazwa produktu</TableCell>
            <TableCell align="right">Ilość</TableCell>
            <TableCell align="right">Cena</TableCell>
            <TableCell align="right">Wartość</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderDetails.map((product: OrderItemResponse, index: number) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor:
                  index % 2 !== 0 ? "background.paper" : "background.default",
              }}
            >
              <TableCell>{product.product_name}</TableCell>
              <TableCell align="right">{product.quantity}</TableCell>
              <TableCell align="right">{product.price} zł</TableCell>
              <TableCell align="right">
                {(product.quantity * parseFloat(product.price)).toFixed(2)} zł
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} align="left">
              <Typography variant={"h6"}>
                Całkowita wartość zamówienia:
              </Typography>
            </TableCell>
            <TableCell align="right">
              {orderDetails
                .reduce(
                  (acc: number, product: OrderItemResponse) =>
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

export default OrderDetailsTable;

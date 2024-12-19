import { useParams } from "react-router-dom";
import {
  useGetOrderDetailsQuery,
  useGetOrderQuery,
} from "../Order/orderApiSlice.ts";
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { OrderDetailsResponse } from "../../types/OrderDetailsResponse.ts";
import { getFormattedDate } from "../../utils/getFormattedDate.ts";
import { getPolishStatus } from "../../utils/getPolishStatus.ts";
import OrderStatusesInfo from "../Order/OrderStatusesInfo.tsx";

function AccountOrderDetails() {
  const { orderId } = useParams();
  const orderDetails = useGetOrderDetailsQuery(orderId as string);
  const order = useGetOrderQuery(orderId as string);

  if (orderDetails.isLoading || order.isLoading) {
    return <CircularProgress />;
  }

  if (orderDetails.isError || order.isError) {
    return <div>Wystąpił błąd!</div>;
  }

  return (
    <Box className={"text-center"}>
      <Box id={"order-details"} className={"mt-1"}>
        <Typography variant={"h5"} className={"font-bold"}>
          Zamówienie numer {order.data?.order_id}
        </Typography>
        <Box
          className={"flex flex-col items-start border rounded p-1 mt-1"}
          sx={{
            borderColor: "text.primary",
          }}
        >
          <Box className={"flex"}>
            <Typography>Status zamówienia:</Typography>
            <Typography className={"font-bold"}>
              {getPolishStatus(order.data?.status)}
            </Typography>
          </Box>
          <Typography>
            Data złożenia zamówienia: {getFormattedDate(order.data?.order_date)}
          </Typography>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        className={"mt-2 mb-2 border "}
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
            {orderDetails.data.map(
              (product: OrderDetailsResponse, index: number) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor:
                      index % 2 !== 0
                        ? "background.paper"
                        : "background.default",
                  }}
                >
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">{product.price} zł</TableCell>
                  <TableCell align="right">
                    {(product.quantity * parseFloat(product.price)).toFixed(2)}{" "}
                    zł
                  </TableCell>
                </TableRow>
              ),
            )}
            <TableRow>
              <TableCell colSpan={3} align="left">
                <Typography variant={"h6"}>
                  Całkowita wartość zamówienia:
                </Typography>
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
      <Box
        className={"flex gap-1 mt-2"}
        sx={{
          display: "flex",
          gap: 1,
          mt: 2,
        }}
      >
        <Box>
          <Typography>Dane do faktury:</Typography>
          <Typography>
            {order.data?.customer_name} {order.data?.customer_surname}
          </Typography>
          <Typography>{order.data?.customer_email}</Typography>
          <Typography>{order.data?.customer_phone}</Typography>
        </Box>
        <Box>
          <Typography>Wysyłka:</Typography>
          <Typography>Kurier DPD - 10 zł</Typography>
          <Typography>
            {order.data?.customer_name} {order.data?.customer_surname}
          </Typography>
          <Typography>{order.data?.customer_email}</Typography>
          <Typography>{order.data?.customer_phone}</Typography>
        </Box>
      </Box>
      <OrderStatusesInfo />
    </Box>
  );
}

export default AccountOrderDetails;

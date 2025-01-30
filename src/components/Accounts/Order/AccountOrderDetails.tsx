import { useParams } from "react-router-dom";
import { useGetOrderQuery } from "../../Order/orderApiSlice.ts";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
import { getPolishStatus } from "@/helpers/getPolishStatus.ts";
import OrderStatusesInfo from "../../Order/OrderStatusesInfo.tsx";
import { useGetOrderItemsQuery } from "../../Order/orderItemsApiSlice.ts";
import ErrorView from "@/components/common/ErrorView.tsx";
import OrderDetailsTable from "@/components/Accounts/Order/OrderDetailsTable.tsx";
import OrderAddresses from "@/components/Accounts/Order/OrderAddresses.tsx";
import InvoiceDownloadButton from "@/components/Order/InvoiceDownloadButton.tsx";
import { OrderType } from "@/enums/OrderType.ts";

function AccountOrderDetails() {
  const { orderId } = useParams();
  const {
    data: orderDetails,
    isLoading: isOrderDetailsLoading,
    isError: isOrderDetailsError,
  } = useGetOrderItemsQuery(orderId as string);
  const {
    data: order,
    isLoading: isOrderLoading,
    isError: isOrderError,
  } = useGetOrderQuery(orderId as string);

  if (isOrderDetailsLoading || isOrderLoading) {
    return <CircularProgress />;
  }

  if (isOrderDetailsError || isOrderError || !orderDetails || !order) {
    return <ErrorView message={"Nie udało się pobrać danych zamówienia"} />;
  }

  return (
    <Box className={"text-center"}>
      <Typography variant={"h5"} className={"font-bold"}>
        Zamówienie numer {order?.order_id}
      </Typography>
      <Box id={"order-details"} className={"mt-1 flex gap-4"}>
        <Box
          className={
            "flex border rounded p-4 mt-4 gap-4 justify-start items-center"
          }
          sx={{
            borderColor: "background.default",
          }}
        >
          <Box className={"flex flex-col items-start"}>
            <Typography>
              Status zamówienia: {getPolishStatus(order?.status)}
            </Typography>
            <Typography>
              Data złożenia zamówienia: {getFormattedDate(order?.order_date)}
            </Typography>
            <Typography>
              Typ zamówienia:{" "}
              {order?.order_type === OrderType.COMPANY
                ? "Firma"
                : "Osoba prywatna"}
            </Typography>
          </Box>
        </Box>
        <Box className={"flex gap-4 justify-end items-end"}>
          <InvoiceDownloadButton orderId={order.order_id} />
        </Box>
      </Box>
      <OrderDetailsTable orderDetails={orderDetails} />
      <Box className={"flex gap-1 mt-4"}>
        <OrderAddresses order={order} />
      </Box>
      <OrderStatusesInfo />
    </Box>
  );
}

export default AccountOrderDetails;

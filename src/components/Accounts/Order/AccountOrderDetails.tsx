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

// TODO: Add invoice

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
      <Box id={"order-details"} className={"mt-1"}>
        <Typography variant={"h5"} className={"font-bold"}>
          Zamówienie numer {order?.order_id}
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
              {getPolishStatus(order?.status)}
            </Typography>
          </Box>
          <Typography>
            Data złożenia zamówienia: {getFormattedDate(order?.order_date)}
          </Typography>
        </Box>
      </Box>
      <OrderDetailsTable orderDetails={orderDetails} />
      <Box className={"flex gap-1 mt-2"}>
        <OrderAddresses order={order} />
      </Box>
      <OrderStatusesInfo />
    </Box>
  );
}

export default AccountOrderDetails;

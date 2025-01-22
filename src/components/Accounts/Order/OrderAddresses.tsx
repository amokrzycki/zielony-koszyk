import { Order } from "@/types/Order.ts";
import { Box, Typography } from "@mui/material";
import { OrderType } from "@/enums/OrderType.ts";

interface OrderAddressesProps {
  order: Order;
}

function OrderAddresses({ order }: OrderAddressesProps) {
  return (
    <>
      <Box>
        <Typography>Dane do faktury:</Typography>
        {order?.order_type === OrderType.COMPANY ? (
          <>
            <Typography>{order?.billingAddress.company_name}</Typography>
            <Typography>{order?.billingAddress.nip}</Typography>
          </>
        ) : (
          <>
            <Typography>{`${order?.billingAddress.first_name} ${order?.billingAddress.last_name}`}</Typography>
          </>
        )}
        <Typography>{order?.customer_email}</Typography>
        <Typography>{order?.billingAddress.phone}</Typography>
        <Typography>{order?.billingAddress.street}</Typography>
      </Box>
      <Box>
        <Typography>Dane do wysyłki:</Typography>
        <Typography>Kurier DPD - 10 zł</Typography>
        {order?.order_type === OrderType.COMPANY ? (
          <>
            <Typography>{order?.shippingAddress.company_name}</Typography>
            <Typography>{order?.shippingAddress.nip}</Typography>
          </>
        ) : (
          <>
            <Typography>{`${order?.shippingAddress.first_name} ${order?.shippingAddress.last_name}`}</Typography>
          </>
        )}
        <Typography>{order?.customer_email}</Typography>
        <Typography>{order?.shippingAddress.phone}</Typography>
        <Typography>{order?.shippingAddress.street}</Typography>
      </Box>
    </>
  );
}

export default OrderAddresses;

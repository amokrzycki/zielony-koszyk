import { Order } from "@/types/Order.ts";
import { Box, Typography } from "@mui/material";
import { OrderType } from "@/enums/OrderType.ts";
import { CustomerType } from "@/enums/CustomerType.ts";
import { generateOrderAddress } from "@/helpers/generateOrderAddress.ts";

interface OrderAddressesProps {
  order: Order;
}

function OrderAddresses({ order }: OrderAddressesProps) {
  return (
    <>
      <Box
        className={"flex flex-col border rounded p-4 gap-1 text-left"}
        sx={{
          borderColor: "background.default",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
          Dane do faktury
        </Typography>
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
        <Typography>{generateOrderAddress(order?.billingAddress)}</Typography>
      </Box>
      <Box
        className={"flex flex-col border rounded p-4 gap-1 text-left"}
        sx={{
          borderColor: "background.default",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
          }}
        >
          Wysyłka
        </Typography>
        {order?.shippingAddress.customer_type === CustomerType.COMPANY ? (
          <>
            <Typography>{order?.shippingAddress.company_name}</Typography>
            <Typography>{order?.shippingAddress.nip}</Typography>
          </>
        ) : (
          <>
            <Typography>{`${order?.shippingAddress.first_name} ${order?.shippingAddress.last_name}`}</Typography>
          </>
        )}
        <Typography>{order?.shippingAddress.phone}</Typography>
        <Typography>{generateOrderAddress(order?.shippingAddress)}</Typography>
        <Typography>Kurier DPD - 10 zł</Typography>
      </Box>
    </>
  );
}

export default OrderAddresses;

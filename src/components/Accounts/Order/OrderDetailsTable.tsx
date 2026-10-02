import type { OrderItemResponse } from "@/types/OrderItemResponse.ts";
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { panelSx, tone } from "@/components/listingStyles.ts";

interface OrderDetailsTableProps {
  orderDetails: OrderItemResponse[];
}

const headCellSx = {
  color: "text.secondary",
  fontSize: "0.78rem",
  fontWeight: 800,
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  borderBottom: "1px solid",
  borderColor: "divider",
  whiteSpace: "nowrap",
} as const;

function OrderDetailsTable({ orderDetails }: OrderDetailsTableProps) {
  const total = orderDetails.reduce(
    (acc: number, product: OrderItemResponse) => acc + product.quantity * parseFloat(product.price),
    0,
  );

  return (
    <TableContainer component={Paper} sx={(theme) => ({ ...panelSx(theme), overflowX: "auto" })}>
      <Table size={"small"} sx={{ minWidth: 460 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headCellSx}>Produkt</TableCell>
            <TableCell align="right" sx={headCellSx}>
              Ilość
            </TableCell>
            <TableCell align="right" sx={headCellSx}>
              Cena
            </TableCell>
            <TableCell align="right" sx={headCellSx}>
              Wartość
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orderDetails.map((product: OrderItemResponse) => (
            <TableRow key={product.order_item_id}>
              <TableCell sx={{ py: 1.5, fontWeight: 600 }}>{product.product_name}</TableCell>
              <TableCell align="right" sx={{ py: 1.5, color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
                {product.quantity}
              </TableCell>
              <TableCell align="right" sx={{ py: 1.5, color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
                {parseFloat(product.price).toFixed(2)} zł
              </TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {(product.quantity * parseFloat(product.price)).toFixed(2)} zł
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow sx={(theme) => ({ bgcolor: tone(theme, 0.06) })}>
            <TableCell colSpan={3} sx={{ borderBottom: "none", fontWeight: 800 }}>
              Razem
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderBottom: "none", fontWeight: 800, fontSize: "1.05rem", fontVariantNumeric: "tabular-nums" }}>
              {total.toFixed(2)} zł
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default OrderDetailsTable;

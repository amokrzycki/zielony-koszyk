import type { OrderItemResponse } from "@/types/OrderItemResponse.ts";
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormat } from "@/i18n/useLocale.ts";
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
  const { t } = useTranslation("account");
  const { currency } = useFormat();
  const total = orderDetails.reduce(
    (acc: number, product: OrderItemResponse) => acc + product.quantity * parseFloat(product.price),
    0,
  );

  return (
    <TableContainer component={Paper} sx={(theme) => ({ ...panelSx(theme), overflowX: "auto" })}>
      <Table size={"small"} sx={{ minWidth: 460 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headCellSx}>{t("orderTable.product")}</TableCell>
            <TableCell align="right" sx={headCellSx}>
              {t("orderTable.quantity")}
            </TableCell>
            <TableCell align="right" sx={headCellSx}>
              {t("orderTable.price")}
            </TableCell>
            <TableCell align="right" sx={headCellSx}>
              {t("orderTable.value")}
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
                {currency(product.price)}
              </TableCell>
              <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {currency(product.quantity * parseFloat(product.price))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow sx={(theme) => ({ bgcolor: tone(theme, 0.06) })}>
            <TableCell colSpan={3} sx={{ borderBottom: "none", fontWeight: 800 }}>
              {t("orderTable.total")}
            </TableCell>
            <TableCell
              align="right"
              sx={{ borderBottom: "none", fontWeight: 800, fontSize: "1.05rem", fontVariantNumeric: "tabular-nums" }}>
              {currency(total)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default OrderDetailsTable;

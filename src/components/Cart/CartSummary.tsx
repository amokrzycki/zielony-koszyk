import { Box, Divider, Typography } from "@mui/material";
import type CartItem from "@/types/CartItem.ts";
import { DELIVERY_FEE } from "@/reducers/cartReducers.ts";
import { useTranslation } from "react-i18next";
import { useFormat } from "@/i18n/useLocale.ts";
import { useLocalizedCartItems } from "./useLocalizedCartItems.ts";

const amountSx = { fontWeight: 700, fontVariantNumeric: "tabular-nums" };

function CartSummary() {
  const { t } = useTranslation(["checkout", "common"]);
  const { currency } = useFormat();
  const cart = useLocalizedCartItems();
  const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.quantity * item.price, 0);

  return (
    <>
      <Typography sx={{ m: 0, mb: 2, fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
        {t("summary.title")}
      </Typography>

      {cart.length === 0 ? (
        <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>{t("summary.empty")}</Typography>
      ) : (
        <>
          <Box
            component="ul"
            sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
            {cart.map((item: CartItem) => (
              <Box
                component="li"
                key={item.productId}
                sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    component="span"
                    sx={{ display: "block", fontWeight: 700, lineHeight: 1.3, overflowWrap: "anywhere" }}>
                    {item.name}
                  </Typography>
                  <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                    {t("quantity.line", { ns: "common", count: item.quantity, price: currency(item.price) })}
                  </Typography>
                </Box>
                <Typography component="span" sx={{ ...amountSx, whiteSpace: "nowrap" }}>
                  {currency(item.quantity * item.price)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ color: "text.secondary" }}>{t("summary.subtotal")}</Typography>
            <Typography sx={amountSx}>{currency(subtotal)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ color: "text.secondary" }}>{t("summary.delivery")}</Typography>
            <Typography sx={amountSx}>{currency(DELIVERY_FEE)}</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Typography sx={{ fontWeight: 800 }}>{t("summary.total")}</Typography>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.6rem", sm: "1.85rem" },
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
              }}>
              {currency(subtotal + DELIVERY_FEE)}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
}

export default CartSummary;

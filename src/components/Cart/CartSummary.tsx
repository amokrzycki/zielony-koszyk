import { Box, Divider, Typography } from "@mui/material";
import type CartItem from "@/types/CartItem.ts";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store.ts";

const DELIVERY_FEE = 10;

const amountSx = { fontWeight: 700, fontVariantNumeric: "tabular-nums" };

function CartSummary() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.quantity * item.price, 0);

  return (
    <>
      <Typography sx={{ m: 0, mb: 2, fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
        Podsumowanie
      </Typography>

      {cart.length === 0 ? (
        <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>Twój koszyk jest pusty.</Typography>
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
                    {item.quantity} szt. × {item.price} zł
                  </Typography>
                </Box>
                <Typography component="span" sx={{ ...amountSx, whiteSpace: "nowrap" }}>
                  {item.quantity * item.price} zł
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ color: "text.secondary" }}>Wartość produktów</Typography>
            <Typography sx={amountSx}>{subtotal} zł</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ color: "text.secondary" }}>Dostawa</Typography>
            <Typography sx={amountSx}>{DELIVERY_FEE} zł</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <Typography sx={{ fontWeight: 800 }}>Razem</Typography>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.6rem", sm: "1.85rem" },
                letterSpacing: "-0.03em",
                fontVariantNumeric: "tabular-nums",
              }}>
              {subtotal + DELIVERY_FEE} zł
            </Typography>
          </Box>
        </>
      )}
    </>
  );
}

export default CartSummary;

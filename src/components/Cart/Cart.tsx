import { useDispatch } from "react-redux";
import type { RootState } from "@/store/store.ts";
import { calculateTotalAmount, changeQuantity, clearCart, removeItem } from "./cartSlice.ts";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import type CartItem from "../../types/CartItem.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks.ts";
import QuantitySelector from "@/components/Products/QuantitySelector.tsx";
import type User from "@/types/User.ts";
import { AddressType } from "@/enums/AddressType.ts";
import { setBillingAddress, setShippingAddress } from "@/components/Order/orderSlice.ts";
import { EASE, accentText, ctaButtonSx, panelSx, tone } from "@/components/listingStyles.ts";

const DELIVERY_FEE = 10;

const amountSx = { fontWeight: 700, fontVariantNumeric: "tabular-nums" };

function Cart() {
  const navigate = useNavigate();
  const cart = useAppSelector((state: RootState) => state.cart.items);
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.quantity * item.price, 0);
  const itemCount = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

  const billingAddress = user.addresses?.find((address) => address.type === AddressType.BILLING && address.default);

  const deliveryAddress = user.addresses?.find((address) => address.type === AddressType.DELIVERY && address.default);

  const handleOrder = () => {
    dispatch(calculateTotalAmount());
    if (user && billingAddress && deliveryAddress) {
      dispatch(setBillingAddress({ ...billingAddress, address_id: 0 }));
      dispatch(setShippingAddress({ ...deliveryAddress, address_id: 0 }));
      navigate("/zamowienie");
    } else {
      navigate("/cart-login");
    }
  };

  return (
    <Box id="main-wrapper" className={"flex flex-col items-center"}>
      <Box
        className="main-container"
        sx={{
          bgcolor: "background.paper",
        }}>
        <Box className={"main-container"} sx={{ mt: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              mb: { xs: 3, sm: 4 },
            }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Twój koszyk
              </Typography>
              {cart.length > 0 && (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    mt: 1,
                    px: 1.25,
                    py: 0.4,
                    borderRadius: "999px",
                    bgcolor: (t) => tone(t, 0.12),
                    color: (t) => accentText(t),
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}>
                  {itemCount} szt.
                </Box>
              )}
            </Box>
            {cart.length > 0 && (
              <Button
                variant="outlined"
                onClick={() => dispatch(clearCart())}
                startIcon={<DeleteIcon fontSize="small" />}
                sx={{
                  borderRadius: "999px",
                  px: 2.25,
                  fontWeight: 700,
                  textTransform: "none",
                  color: "text.secondary",
                  borderColor: "divider",
                  transition: `color 200ms ${EASE}, border-color 200ms ${EASE}`,
                  "&:hover": { color: "primary.main", borderColor: "primary.main", backgroundColor: "transparent" },
                  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
                }}>
                Wyczyść koszyk
              </Button>
            )}
          </Box>

          {cart.length === 0 ? (
            <Box
              sx={(theme) => ({
                ...panelSx(theme),
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 1,
                py: { xs: 7, sm: 10 },
                px: 3,
              })}>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 64,
                  height: 64,
                  mb: 1,
                  borderRadius: "50%",
                  color: "primary.main",
                  bgcolor: (t) => tone(t, 0.12),
                  "& svg": { fontSize: 30 },
                }}>
                <ShoppingCartOutlinedIcon />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                Twój koszyk jest pusty
              </Typography>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.6, maxWidth: "42ch" }}>
                Zajrzyj do naszej oferty i dodaj pierwsze produkty do koszyka.
              </Typography>
              <Button component={Link} to="/produkty" sx={{ ...ctaButtonSx, mt: 2 }}>
                Przeglądaj produkty
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 360px" },
                gap: { xs: 3, lg: 5 },
                alignItems: "start",
              }}>
              <Box
                component="ul"
                aria-label="Produkty w koszyku"
                sx={(theme) => ({
                  ...panelSx(theme),
                  listStyle: "none",
                  m: 0,
                  p: { xs: 2, sm: 3 },
                })}>
                {cart.map((item: CartItem) => (
                  <Box
                    component="li"
                    key={item.productId}
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: { xs: 1.5, sm: 3 },
                      py: 2.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      "&:first-of-type": { pt: 0 },
                      "&:last-of-type": { pb: 0, borderBottom: "none" },
                    }}>
                    <Box sx={{ flex: "1 1 220px", minWidth: 0 }}>
                      <Typography
                        component="span"
                        sx={{
                          display: "block",
                          fontWeight: 800,
                          fontSize: { xs: "1rem", sm: "1.05rem" },
                          lineHeight: 1.25,
                          letterSpacing: "-0.01em",
                          overflowWrap: "anywhere",
                        }}>
                        {item.name}
                      </Typography>
                      <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                        {item.price.toFixed(2)} zł / szt.
                      </Typography>
                    </Box>

                    <QuantitySelector
                      quantity={item.quantity}
                      setQuantity={(newVal) =>
                        dispatch(
                          changeQuantity({
                            productId: item.productId,
                            quantity: newVal,
                          }),
                        )
                      }
                    />

                    <Typography
                      sx={{
                        minWidth: { sm: 96 },
                        textAlign: "right",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        letterSpacing: "-0.02em",
                        fontVariantNumeric: "tabular-nums",
                      }}>
                      {(item.quantity * item.price).toFixed(2)} zł
                    </Typography>

                    <IconButton
                      aria-label={`Usuń ${item.name} z koszyka`}
                      onClick={() => dispatch(removeItem(item.productId))}
                      size="small"
                      sx={{
                        color: "text.secondary",
                        transition: `color 200ms ${EASE}`,
                        "&:hover": { color: "error.main", backgroundColor: "transparent" },
                        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
                      }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Box component="aside" sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3 } })}>
                <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 2 }}>Podsumowanie</Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ color: "text.secondary" }}>Wartość produktów</Typography>
                  <Typography sx={amountSx}>{subtotal.toFixed(2)} zł</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ color: "text.secondary" }}>Dostawa</Typography>
                  <Typography sx={amountSx}>{DELIVERY_FEE} zł</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 3 }}>
                  <Typography sx={{ fontWeight: 800 }}>Razem</Typography>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "1.6rem", sm: "1.85rem" },
                      letterSpacing: "-0.03em",
                      fontVariantNumeric: "tabular-nums",
                    }}>
                    {(subtotal + DELIVERY_FEE).toFixed(2)} zł
                  </Typography>
                </Box>

                <Button fullWidth onClick={handleOrder} sx={ctaButtonSx}>
                  Wybierz dostawę i płatność
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Cart;

import { type MouseEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import type { RootState } from "@/store/store.ts";
import { calculateTotalAmount, changeQuantity, clearCart, removeItem } from "./cartSlice.ts";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import type CartItem from "../../types/CartItem.ts";
import { DELIVERY_FEE } from "@/reducers/cartReducers.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/hooks.ts";
import { useTranslation } from "react-i18next";
import { useFormat, useLocalePath } from "@/i18n/useLocale.ts";
import { useLocalizedCartItems } from "./useLocalizedCartItems.ts";
import QuantitySelector from "@/components/Products/QuantitySelector.tsx";
import type User from "@/types/User.ts";
import { AddressType } from "@/enums/AddressType.ts";
import { setBillingAddress, setShippingAddress } from "@/components/Order/orderSlice.ts";
import { EASE, accentText, ctaButtonSx, panelSx, tone } from "@/components/listingStyles.ts";
import SwapLayers from "@/components/common/SwapLayers.tsx";

/** Press-and-hold time for clearing the whole cart. Quick clicks do not clear. */
const HOLD_TO_CLEAR_MS = 700;

const amountSx = { fontWeight: 700, fontVariantNumeric: "tabular-nums" };
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Cart() {
  const navigate = useNavigate();
  const { t } = useTranslation(["checkout", "common"]);
  const { currency } = useFormat();
  const to = useLocalePath();
  const cart = useLocalizedCartItems();
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const holdTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [holdingClear, setHoldingClear] = useState(false);

  useEffect(() => () => clearTimeout(holdTimer.current), []);

  const startClearHold = () => {
    if (prefersReducedMotion()) {
      dispatch(clearCart());
      return;
    }
    setHoldingClear(true);
    holdTimer.current = setTimeout(() => {
      setHoldingClear(false);
      dispatch(clearCart());
    }, HOLD_TO_CLEAR_MS);
  };

  const cancelClearHold = () => {
    clearTimeout(holdTimer.current);
    setHoldingClear(false);
  };

  // Row collapses then leaves, so removing an item does not snap the summary.
  const handleRemove = (event: MouseEvent<HTMLButtonElement>, productId: number) => {
    const row = event.currentTarget.closest("li");
    if (!row || prefersReducedMotion()) {
      dispatch(removeItem(productId));
      return;
    }
    const styles = window.getComputedStyle(row);
    row.style.overflow = "hidden";
    row.animate(
      [
        {
          height: `${row.getBoundingClientRect().height}px`,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          borderBottomWidth: styles.borderBottomWidth,
          opacity: 1,
          transform: "translateX(0)",
        },
        {
          height: "0px",
          paddingTop: "0px",
          paddingBottom: "0px",
          borderBottomWidth: "0px",
          opacity: 0,
          transform: "translateX(-6px)",
        },
      ],
      { duration: 220, easing: EASE, fill: "forwards" },
    ).onfinish = () => dispatch(removeItem(productId));
  };

  const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.quantity * item.price, 0);
  const itemCount = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

  const billingAddress = user.addresses?.find((address) => address.type === AddressType.BILLING && address.default);

  const deliveryAddress = user.addresses?.find((address) => address.type === AddressType.DELIVERY && address.default);

  const handleOrder = () => {
    dispatch(calculateTotalAmount());
    if (user && billingAddress && deliveryAddress) {
      dispatch(setBillingAddress({ ...billingAddress, address_id: 0 }));
      dispatch(setShippingAddress({ ...deliveryAddress, address_id: 0 }));
      navigate(to("order"));
    } else {
      navigate(to("cartLogin"));
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
                {t("cart.title")}
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
                  {t("quantity.pieces", { ns: "common", count: itemCount })}
                </Box>
              )}
            </Box>
            {cart.length > 0 && (
              <Button
                variant="outlined"
                onPointerDown={startClearHold}
                onPointerUp={cancelClearHold}
                onPointerLeave={cancelClearHold}
                onPointerCancel={cancelClearHold}
                onClick={(event) => {
                  // Keyboard and assistive-tech activation has no pointer hold; clear at once.
                  if (event.detail === 0) dispatch(clearCart());
                }}
                aria-label={t("cart.clearAria")}
                sx={{
                  position: "relative",
                  overflow: "hidden",
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
                <Box
                  className="hold-fill"
                  sx={{
                    transform: holdingClear ? "scaleX(1)" : "scaleX(0)",
                    transition: holdingClear ? `transform ${HOLD_TO_CLEAR_MS}ms linear` : `transform 200ms ${EASE}`,
                  }}
                />
                <Box
                  component="span"
                  sx={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 1 }}>
                  <DeleteIcon fontSize="small" />
                  {holdingClear ? t("cart.holding") : t("cart.clear")}
                </Box>
              </Button>
            )}
          </Box>

          <SwapLayers id={cart.length === 0 ? "empty" : "list"} tween="swap">
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
                  {t("cart.emptyTitle")}
                </Typography>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6, maxWidth: "42ch" }}>
                  {t("cart.emptyText")}
                </Typography>
                <Button component={Link} to={to("products")} sx={{ ...ctaButtonSx, mt: 2 }}>
                  {t("cart.browse")}
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
                  aria-label={t("cart.itemsAria")}
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
                          {t("quantity.unitPrice", { ns: "common", price: currency(item.price) })}
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
                        {currency(item.quantity * item.price)}
                      </Typography>

                      <IconButton
                        aria-label={t("cart.removeAria", { name: item.name })}
                        onClick={(event) => handleRemove(event, item.productId)}
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
                  <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 2 }}>{t("summary.title")}</Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ color: "text.secondary" }}>{t("summary.subtotal")}</Typography>
                    <Typography sx={amountSx}>{currency(subtotal)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ color: "text.secondary" }}>{t("summary.delivery")}</Typography>
                    <Typography sx={amountSx}>{currency(DELIVERY_FEE)}</Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 3 }}>
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

                  <Button fullWidth onClick={handleOrder} sx={ctaButtonSx}>
                    {t("cart.checkout")}
                  </Button>
                </Box>
              </Box>
            )}
          </SwapLayers>
        </Box>
      </Box>
    </Box>
  );
}

export default Cart;

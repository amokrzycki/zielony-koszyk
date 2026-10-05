import { useAppDispatch, useAppSelector } from "@/hooks/hooks.ts";
import { Box, Button, Checkbox, Divider, FormControlLabel, Typography } from "@mui/material";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import type { ReactNode } from "react";
import { useState } from "react";
import type CartItem from "../../types/CartItem.ts";
import type { CreateOrder } from "@/types/CreateOrder.ts";
import { useCreateOrderMutation } from "./orderApiSlice.ts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiErrorMessage } from "@/helpers/apiError.ts";
import { useLocalePath } from "@/i18n/useLocale.ts";
import { clearCart } from "../Cart/cartSlice.ts";
import { clearOrder } from "./orderSlice.ts";
import toast from "react-hot-toast";
import type { RootState } from "@/store/store.ts";
import type { CartState } from "@/reducers/cartReducers.ts";
import { OrderType } from "@/enums/OrderType.ts";
import ErrorView from "@/components/common/ErrorView.tsx";
import { generateOrderAddress } from "@/helpers/generateOrderAddress.ts";
import { CustomerType } from "@/enums/CustomerType.ts";
import CartSummary from "@/components/Cart/CartSummary.tsx";
import { accentText, ctaButtonSx, ghostButtonSx, panelSx, sectionHeadingSx, tone } from "@/components/listingStyles.ts";

/** Label/value row used by both address blocks, so the two sections read as one system. */
function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "minmax(120px, 0.35fr) 1fr" },
        columnGap: 2,
        rowGap: 0.25,
        py: 1.25,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-of-type": { borderBottom: "none", pb: 0 },
      }}>
      <Typography component="dt" sx={{ color: "text.secondary", fontSize: "0.85rem", lineHeight: 1.5 }}>
        {label}
      </Typography>
      <Typography component="dd" sx={{ m: 0, fontWeight: 700, lineHeight: 1.5, overflowWrap: "anywhere" }}>
        {value}
      </Typography>
    </Box>
  );
}

function OrderSummary() {
  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("checkout");
  const to = useLocalePath();
  const orderInfo: CreateOrder = useAppSelector((state) => state.order.orderInfo);
  const cart: CartState = useAppSelector((state: RootState) => state.cart);
  const cartItems = cart.items;
  const [createOrder] = useCreateOrderMutation();

  if (!orderInfo.customer_email || !cartItems) {
    return (
      <Box id="main-wrapper" className="flex flex-col items-center">
        <Box className="main-container" sx={{ bgcolor: "background.paper" }}>
          <Box className="main-container" sx={{ mt: 0 }}>
            <Box sx={(theme) => ({ ...panelSx(theme), p: { xs: 3, sm: 4 } })}>
              <ErrorView message={t("orderSummary.missingTitle")} errorText={t("orderSummary.missingText")} />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  const createOrderItems = () => {
    return cart.items.map((item: CartItem) => ({
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));
  };

  const handleOrder = () => {
    const order: CreateOrder = {
      ...orderInfo,
      orderItems: createOrderItems(),
    };
    toast
      .promise(createOrder(order).unwrap(), {
        loading: t("orderSummary.toast.loading"),
        success: t("orderSummary.toast.success"),
        error: (error) => apiErrorMessage(i18n.t, error, t("orderSummary.toast.error")),
      })
      .then(() => {
        dispatch(clearCart());
        dispatch(clearOrder());
        navigate(to("orderConfirmation"));
      });
  };

  const shipping = orderInfo.shippingAddress;
  const billing = orderInfo.billingAddress;

  return (
    <Box id="main-wrapper" className="flex flex-col items-center">
      <Box className="main-container" sx={{ bgcolor: "background.paper" }}>
        <Box className="main-container" sx={{ mt: 0 }}>
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              component="h1"
              sx={{
                m: 0,
                fontSize: "clamp(1.6rem, 3vw, 2.1rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}>
              {t("orderSummary.title")}
            </Typography>
            <Typography sx={{ mt: 1, color: "text.secondary", lineHeight: 1.6, maxWidth: "52ch" }}>
              {t("orderSummary.subtitle")}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 360px" },
              gap: { xs: 3, lg: 5 },
              alignItems: "start",
            }}>
            <Box
              component="section"
              aria-labelledby="order-shipping-heading"
              sx={(theme) => ({ ...panelSx(theme), p: { xs: 2, sm: 3 } })}>
              <Typography component="h2" id="order-shipping-heading" sx={sectionHeadingSx}>
                {t("orderSummary.shippingTitle")}
              </Typography>
              <Box component="dl" sx={{ m: 0 }}>
                <DetailRow label={t("orderSummary.recipient")} value={`${shipping.first_name} ${shipping.last_name}`} />
                {shipping.customer_type === CustomerType.COMPANY && (
                  <>
                    <DetailRow label={t("orderSummary.company")} value={shipping.company_name} />
                    <DetailRow label={t("form.nip")} value={shipping.nip} />
                  </>
                )}
                <DetailRow label={t("orderSummary.phone")} value={shipping.phone} />
                <DetailRow label={t("orderSummary.email")} value={orderInfo.customer_email} />
                <DetailRow label={t("orderSummary.address")} value={generateOrderAddress(shipping)} />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography component="h2" id="order-billing-heading" sx={sectionHeadingSx}>
                {t("billing.title")}
              </Typography>
              {orderInfo.same_address ? (
                <Box
                  sx={{
                    mt: 1.5,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: "12px",
                    bgcolor: (theme) => tone(theme, 0.1),
                    color: (theme) => accentText(theme),
                  }}>
                  <ReceiptLongOutlined fontSize="small" sx={{ mt: "1px" }} />
                  <Typography sx={{ color: "inherit", fontSize: "0.9rem", lineHeight: 1.5 }}>
                    {t("orderSummary.billingSame")}
                  </Typography>
                </Box>
              ) : (
                <Box component="dl" sx={{ m: 0 }}>
                  <DetailRow label={t("orderSummary.buyer")} value={`${billing.first_name} ${billing.last_name}`} />
                  {orderInfo.order_type === OrderType.COMPANY && (
                    <>
                      <DetailRow label={t("orderSummary.company")} value={billing.company_name} />
                      <DetailRow label={t("form.nip")} value={billing.nip} />
                    </>
                  )}
                  <DetailRow label={t("orderSummary.phone")} value={billing.phone} />
                  <DetailRow label={t("orderSummary.address")} value={generateOrderAddress(billing)} />
                </Box>
              )}
            </Box>

            <Box
              component="aside"
              aria-label={t("summary.asideAria")}
              sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3 } })}>
              <CartSummary />

              <FormControlLabel
                sx={{
                  mt: 2,
                  mx: 0,
                  alignItems: "flex-start",
                  gap: 0.5,
                  "& .MuiFormControlLabel-label": { fontSize: "0.875rem", lineHeight: 1.5, py: "9px" },
                }}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() => setChecked((prev) => !prev)}
                    sx={{ p: 0.75, mt: -0.25 }}
                  />
                }
                label={t("orderSummary.terms")}
              />

              <Button fullWidth disabled={!checked} onClick={handleOrder} sx={{ ...ctaButtonSx, mt: 2 }}>
                {t("orderSummary.submit")}
              </Button>

              {!checked && (
                <Typography
                  sx={{
                    mt: 1.5,
                    color: "text.secondary",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}>
                  {t("orderSummary.acceptTerms")}
                </Typography>
              )}

              <Typography component="p" sx={{ mt: 2, color: "text.secondary", fontSize: "0.8rem", lineHeight: 1.55 }}>
                {t("orderSummary.contractNote")}
              </Typography>

              <Button
                fullWidth
                onClick={() => navigate(to("order"))}
                sx={(theme) => ({ ...ghostButtonSx(theme), mt: 2 })}>
                {t("orderSummary.back")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderSummary;

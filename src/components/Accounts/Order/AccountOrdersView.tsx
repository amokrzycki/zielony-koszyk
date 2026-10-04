import LoadingOverlay from "@/components/common/LoadingOverlay.tsx";
import { Box, Button, Typography } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useGetUserOrdersQuery } from "../../Order/orderApiSlice.ts";
import { useAppSelector } from "@/hooks/hooks.ts";
import type { RootState } from "@/store/store.ts";
import type User from "../../../types/User.ts";
import { getFormattedDate } from "@/helpers/getFormattedDate.ts";
import OrderStatusPill from "@/components/Order/OrderStatusPill.tsx";
import ErrorView from "@/components/common/ErrorView.tsx";
import { EASE, accentText, ctaButtonSx, tone } from "@/components/listingStyles.ts";

function AccountOrdersView() {
  const user: User = useAppSelector((state: RootState) => state.auth.user);
  const userOrders = useGetUserOrdersQuery(user.user_id);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only want to refetch on mount
  useEffect(() => {
    userOrders.refetch();
  }, []);

  if (userOrders.isLoading || userOrders.isFetching) {
    return <LoadingOverlay />;
  }

  if (userOrders.isError || !userOrders.data) {
    return (
      <div className="fade-in">
        <ErrorView message="Nie udało się pobrać Twoich zamówień" />
      </div>
    );
  }

  const orders = userOrders.data;

  return (
    <div className="fade-in">
      <Box sx={{ maxWidth: 720, mx: "auto", textAlign: "left" }}>
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontSize: { xs: "1.7rem", md: "2.05rem" },
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}>
          Zamówienia
        </Typography>
        <Typography sx={{ mt: 1, color: "text.secondary", maxWidth: "54ch", lineHeight: 1.6 }}>
          Twoja historia zakupów — sprawdź status i szczegóły każdego zamówienia.
        </Typography>

        {orders.length === 0 ? (
          <Box
            sx={(theme) => ({
              mt: { xs: 3, md: 3.5 },
              py: { xs: 5, sm: 6 },
              px: { xs: 3, sm: 4 },
              borderRadius: "24px",
              textAlign: "center",
              bgcolor: tone(theme, 0.05),
            })}>
            <Box
              aria-hidden
              sx={{
                display: "grid",
                placeItems: "center",
                width: 56,
                height: 56,
                mx: "auto",
                borderRadius: "50%",
                color: (t) => accentText(t),
                bgcolor: (t) => tone(t, 0.12),
                "& svg": { fontSize: 28 },
              }}>
              <ShoppingBagOutlined />
            </Box>
            <Typography
              component="h2"
              sx={{ mt: 2, fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>
              Nie masz jeszcze zamówień
            </Typography>
            <Typography sx={{ mt: 0.75, mx: "auto", maxWidth: "40ch", color: "text.secondary", lineHeight: 1.6 }}>
              Gdy złożysz pierwsze zamówienie, pojawi się tutaj wraz z aktualnym statusem dostawy.
            </Typography>
            <Button component={Link} to="/produkty" sx={{ ...ctaButtonSx, mt: 3 }}>
              Przejdź do produktów
            </Button>
          </Box>
        ) : (
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, mt: { xs: 3, md: 3.5 }, display: "grid", gap: 1 }}>
            {orders.map((order) => {
              const total = Number(order.total_amount);
              const amount = Number.isFinite(total) ? total.toFixed(2) : order.total_amount;

              return (
                <Box component="li" key={order.order_id}>
                  <Box
                    component={Link}
                    to={`/konto/zamowienia/${order.order_id}`}
                    sx={(theme) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: "14px",
                      bgcolor: tone(theme, 0.05),
                      color: "text.primary",
                      textDecoration: "none",
                      transition: `background-color 200ms ${EASE}`,
                      "&:hover": { bgcolor: tone(theme, 0.11) },
                      "&:hover .order-row-arrow": { transform: "translateX(4px)", color: accentText(theme) },
                      "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
                    })}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
                        <Typography
                          sx={{
                            fontSize: { xs: "1.05rem", sm: "1.15rem" },
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.2,
                          }}>
                          #{order.order_id}
                        </Typography>
                        <OrderStatusPill status={order.status} />
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5, color: "text.secondary" }}>
                        <ScheduleOutlined sx={{ fontSize: 15 }} />
                        <Typography
                          component="span"
                          sx={{ fontSize: "0.85rem", lineHeight: 1.4, fontVariantNumeric: "tabular-nums" }}>
                          {getFormattedDate(order.order_date)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        flexShrink: 0,
                        fontWeight: 800,
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                      }}>
                      {amount}{" "}
                      <Box component="span" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.85em" }}>
                        zł
                      </Box>
                    </Typography>
                    <ArrowForward
                      className="order-row-arrow"
                      sx={{
                        fontSize: 20,
                        flexShrink: 0,
                        color: "text.secondary",
                        transition: `transform 200ms ${EASE}, color 200ms ${EASE}`,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </div>
  );
}

export default AccountOrdersView;

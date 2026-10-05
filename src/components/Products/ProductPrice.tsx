import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormat } from "@/i18n/useLocale.ts";

interface ProductPriceProps {
  price: number;
  quantity: number;
}

function ProductPrice({ price, quantity }: ProductPriceProps) {
  const { t } = useTranslation();
  const { currency } = useFormat();
  const hasQuantity = quantity > 1;

  return (
    <Box className={"flex items-baseline gap-1.5"}>
      <Typography
        component="span"
        sx={{
          fontSize: { xs: "1.35rem", sm: "1.6rem" },
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
        }}>
        {currency(price * quantity)}
      </Typography>
      {hasQuantity && (
        <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
          × {t("quantity.pieces", { count: quantity })}
        </Typography>
      )}
    </Box>
  );
}

export default ProductPrice;

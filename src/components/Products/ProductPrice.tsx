import { Box, Typography } from "@mui/material";

interface ProductPriceProps {
  price: number;
  quantity: number;
}

function ProductPrice({ price, quantity }: ProductPriceProps) {
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
        {(price * quantity).toFixed(2)}
      </Typography>
      <Typography component="span" sx={{ color: "text.secondary", fontWeight: 600 }}>
        zł
      </Typography>
      {hasQuantity && (
        <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
          × {quantity} szt.
        </Typography>
      )}
    </Box>
  );
}

export default ProductPrice;

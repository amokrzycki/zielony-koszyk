import type Product from "../../types/Product.ts";
import { Box, Typography } from "@mui/material";
import capitalizeFirstLetter from "@/helpers/capitalizeFirstLetter.ts";
import { accentText, tone } from "@/components/listingStyles.ts";

interface ProductInfoProps {
  product: Product;
}

function ProductInfo({ product }: ProductInfoProps) {
  return (
    <Box sx={{ display: "flex", minWidth: 0, flexDirection: "column", gap: 1 }}>
      <Typography
        component="h3"
        sx={{
          fontSize: { xs: "1.05rem", sm: "1.2rem" },
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          textWrap: "balance",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
        {product.name}
      </Typography>
      {product.description && (
        <Typography
          component="p"
          sx={{
            color: "text.secondary",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
          {product.description}
        </Typography>
      )}
      <Box className={"flex flex-wrap gap-2"}>
        <Typography
          component="span"
          sx={{
            px: 1.25,
            py: 0.4,
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            lineHeight: 1.2,
            color: (t) => accentText(t),
            bgcolor: (t) => tone(t, 0.12),
          }}>
          {capitalizeFirstLetter(product.category)}
        </Typography>
        <Typography
          component="span"
          sx={{
            px: 1.25,
            py: 0.4,
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 600,
            lineHeight: 1.2,
            color: "text.secondary",
            bgcolor: "action.hover",
          }}>
          Dostępnych: {product.stock_quantity}
        </Typography>
      </Box>
    </Box>
  );
}

export default ProductInfo;

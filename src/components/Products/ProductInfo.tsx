import type Product from "../../types/Product.ts";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormat } from "@/i18n/useLocale.ts";
import capitalizeFirstLetter from "@/helpers/capitalizeFirstLetter.ts";
import { accentText, tone } from "@/components/listingStyles.ts";

interface ProductInfoProps {
  product: Product;
  /** "detail" scales the block up and promotes the name to the page title on the product page. */
  size?: "card" | "detail";
}

function ProductInfo({ product, size = "card" }: ProductInfoProps) {
  const { t } = useTranslation(["catalog", "common"]);
  const { number } = useFormat();
  const isDetail = size === "detail";

  return (
    <Box sx={{ display: "flex", minWidth: 0, flexDirection: "column", gap: isDetail ? 1.5 : 1 }}>
      <Typography
        component={isDetail ? "h1" : "h3"}
        sx={{
          m: 0,
          fontSize: isDetail ? { xs: "1.6rem", sm: "1.9rem", lg: "2.1rem" } : { xs: "1.05rem", sm: "1.2rem" },
          fontWeight: 800,
          lineHeight: isDetail ? 1.15 : 1.2,
          letterSpacing: "-0.02em",
          textWrap: "balance",
          ...(isDetail
            ? {}
            : { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }),
        }}>
        {product.name}
      </Typography>
      {product.description && (
        <Typography
          component="p"
          sx={{
            color: "text.secondary",
            lineHeight: isDetail ? 1.6 : 1.5,
            ...(isDetail
              ? {}
              : { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }),
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
          {t(`categories.${product.category}`, { ns: "common", defaultValue: capitalizeFirstLetter(product.category) })}
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
          {t("product.stock", { stock: number(product.stock_quantity) })}
        </Typography>
      </Box>
    </Box>
  );
}

export default ProductInfo;

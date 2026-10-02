import type Product from "../../types/Product.ts";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { addItem } from "../Cart/cartSlice.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import QuantitySelector from "./QuantitySelector.tsx";
import ProductInfo from "./ProductInfo.tsx";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import ProductPrice from "@/components/Products/ProductPrice.tsx";
import { API_URL } from "@/constants/api.ts";
import FadeImage from "@/components/common/FadeImage.tsx";
import { EASE, panelSx, tone } from "@/components/listingStyles.ts";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(
      addItem({
        productId: product.product_id,
        name: product.name,
        quantity: quantity,
        price: product.price,
      }),
    );
    toast.success("Produkt został dodany do koszyka");
  };

  return (
    <Box
      className="group relative flex w-full gap-4 rounded-2xl p-4 sm:gap-5 sm:p-5"
      sx={(theme) => ({
        ...panelSx(theme),
        transition: `transform 300ms ${EASE}, box-shadow 300ms ${EASE}, border-color 300ms ${EASE}`,
        "&:hover, &:focus-within": {
          transform: "translateY(-2px)",
          borderColor: "primary.main",
          boxShadow: theme.palette.mode === "dark" ? "0 22px 50px rgba(0,0,0,0.6)" : "0 22px 50px rgba(15,40,28,0.16)",
        },
        "&:focus-within": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
        "&:hover .MuiProductCardPhoto-root": { transform: "scale(1.05)" },
      })}>
      <NavLink
        to={`/produkty/${product.product_id}`}
        aria-label={product.name}
        className={"absolute inset-0 z-[1] rounded-2xl focus:outline-none"}
      />
      <Box
        className={"MuiProductCardPhoto-root"}
        sx={{
          display: "grid",
          flexShrink: 0,
          placeItems: "center",
          width: { xs: 88, sm: 132 },
          height: { xs: 88, sm: 132 },
          p: 1.5,
          borderRadius: "18px",
          bgcolor: (t) => tone(t, 0.07),
          transition: `transform 500ms ${EASE}`,
        }}>
        <FadeImage
          src={`${API_URL}/${product.image}`}
          alt=""
          sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </Box>
      <Box className={"flex min-w-0 grow flex-col gap-3"}>
        <ProductInfo product={product} />
        <Box className={"mt-auto flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"}>
          <ProductPrice price={product.price} quantity={quantity} />
          <Box className={"z-10 flex flex-col gap-2 sm:flex-row sm:items-center"}>
            <QuantitySelector quantity={quantity} setQuantity={(newVal) => setQuantity(newVal)} />
            <Button
              onClick={handleAddToCart}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "auto" },
                whiteSpace: "nowrap",
                bgcolor: "primary.main",
                color: "#0b1410",
                borderRadius: "999px",
                px: 2.5,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "none",
                transition: `transform 300ms ${EASE}, box-shadow 300ms ${EASE}`,
                "&:hover": { bgcolor: "primary.main", boxShadow: "none", transform: "translateY(-2px)" },
                "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
              }}>
              Do koszyka
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;

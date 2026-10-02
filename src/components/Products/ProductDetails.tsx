import { Box, Button, Divider, Typography } from "@mui/material";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "@/components/Products/productsApiSlice.ts";
import AutoBreadcrumbs from "@/components/AutoBreadcrumbs.tsx";
import Loading from "@/components/common/Loading.tsx";
import ErrorView from "@/components/common/ErrorView.tsx";
import { useState } from "react";
import QuantitySelector from "@/components/Products/QuantitySelector.tsx";
import { useAppDispatch } from "@/hooks/hooks.ts";
import { addItem } from "../Cart/cartSlice";
import toast from "react-hot-toast";
import FeaturedProducts from "@/components/Products/FeaturedProducts.tsx";
import ProductPrice from "@/components/Products/ProductPrice.tsx";
import ProductInfo from "@/components/Products/ProductInfo.tsx";
import { API_URL } from "@/constants/api.ts";
import { accentText, ctaButtonSx, panelSx, tone } from "@/components/listingStyles.ts";

function ProductDetails() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const { data: product, isLoading, isError } = useGetProductByIdQuery(parseInt(productId, 10));

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !product) {
    return <ErrorView />;
  }

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
    <Box id="main-wrapper">
      <Box
        component="section"
        sx={{
          width: "100%",
          maxWidth: 1560,
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 3, sm: 4, lg: 6 },
        }}>
        <Box sx={{ mb: { xs: 2.5, lg: 3.5 } }}>
          <AutoBreadcrumbs />
        </Box>

        <Box component="article" aria-label="Szczegóły produktu" sx={(theme) => ({ ...panelSx(theme), p: { xs: 2.5, sm: 3.5, lg: 5 } })}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1.1fr)" },
              gap: { xs: 3.5, sm: 4, md: 6 },
              alignItems: "center",
            }}>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: "100%",
                p: { xs: 3, sm: 4 },
                borderRadius: "24px",
                bgcolor: (t) => tone(t, 0.07),
                aspectRatio: "1 / 1",
                overflow: "hidden",
              }}>
              <Box
                component="img"
                src={`${API_URL}/${product.image}`}
                alt={product.name}
                sx={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>

            <Box sx={{ display: "flex", minWidth: 0, flexDirection: "column" }}>
              <ProductInfo product={product} size="detail" />

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}>
                <ProductPrice price={product.price} quantity={quantity} />
                <QuantitySelector quantity={quantity} setQuantity={(newVal) => setQuantity(newVal)} />
              </Box>

              <Button
                onClick={handleAddToCart}
                startIcon={<AddShoppingCartOutlinedIcon />}
                sx={{ ...ctaButtonSx, mt: 3, alignSelf: { xs: "stretch", sm: "flex-start" } }}>
                Do koszyka
              </Button>

              <Box sx={{ mt: 2.5, display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShippingOutlinedIcon sx={{ fontSize: 20, color: (t) => accentText(t) }} />
                <Typography sx={{ color: "text.secondary", fontSize: "0.875rem", lineHeight: 1.45 }}>
                  Dostawa w Rzeszowie i okolicach.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <FeaturedProducts />
      </Box>
    </Box>
  );
}

export default ProductDetails;

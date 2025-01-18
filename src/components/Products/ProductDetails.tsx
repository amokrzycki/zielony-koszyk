import { Box, Button } from "@mui/material";
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

function ProductDetails() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  if (!productId) {
    throw new Error("Product ID is required");
  }

  const {
    data: product,
    isLoading,
    isError,
  } = useGetProductByIdQuery(parseInt(productId));

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
    toast.success("Produkt zostały dodany do koszyka");
  };

  return (
    <Box id={"main-wrapper"}>
      <Box className={"main-container"} sx={{ bgcolor: "background.paper" }}>
        <Box className={"main-container"} sx={{ mt: 0 }}>
          <AutoBreadcrumbs />
          <Box className={"mt-4 flex xl:justify-between max-xl:flex-col"}>
            <Box className={"flex flex-col max-xl:items-center"}>
              <img
                src={`http://localhost:3000/${product.image}`}
                alt={product.name}
                style={{ height: "400px", width: "400px" }}
              />
              <Box className={"flex flex-col mt-8"}>
                <ProductInfo product={product} />
                <Box className={"flex flex-col gap-4 mt-4 items-end"}>
                  <ProductPrice price={product.price} quantity={quantity} />
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={(newVal) => setQuantity(newVal)}
                  />
                  <Button onClick={handleAddToCart} variant="contained">
                    Do koszyka
                  </Button>
                </Box>
              </Box>
            </Box>
            <FeaturedProducts />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductDetails;

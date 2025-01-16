import { Box, Button, Typography } from "@mui/material";
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
          <Box className={"mt-4"}>
            <img
              src={`http://localhost:3000/${product.image}`}
              alt={product.name}
            />
            <Typography variant={"h4"}>{product.name}</Typography>
            <Typography variant={"h6"}>{product.description}</Typography>
            <Typography variant={"h6"}>{product.price}</Typography>
            <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
            <Box>
              <Button onClick={handleAddToCart} variant="contained">
                Do koszyka
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductDetails;

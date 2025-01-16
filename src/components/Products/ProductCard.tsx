import Product from "../../types/Product.ts";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { addItem } from "../Cart/cartSlice.ts";
import { useAppDispatch } from "@/hooks/hooks.ts";
import QuantitySelector from "./QuantitySelector.tsx";
import ProductInfo from "./ProductInfo.tsx";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

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
    toast.success("Produkt zostały dodany do koszyka");
  };

  return (
    <Box className={"flex w-300 border-b-2 p-4 relative"}>
      <NavLink
        to={`/produkty/${product.product_id}`}
        className={"h-full left-0 top-0 absolute w-full z-[1]"}
      />
      <img
        src={`http://localhost:3000/${product.image}`}
        alt="product-image"
        style={{ height: "200px" }}
      />
      <Box className={"grid w-full"}>
        <ProductInfo product={product} />
        <Box
          className={
            "flex flex-col justify-between items-center gap-2 justify-self-end z-10"
          }
        >
          <Box>
            {quantity > 1 ? (
              <>
                <Typography variant="h5" component="span" fontWeight={"500"}>
                  {(product.price * quantity).toFixed(2)}
                </Typography>{" "}
                zł x {quantity} szt.
              </>
            ) : (
              <>
                <Typography variant="h5" component="span" fontWeight={"500"}>
                  {product.price}
                </Typography>{" "}
                zł
              </>
            )}
          </Box>
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
          <Button onClick={handleAddToCart} variant="contained">
            Do koszyka
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductCard;

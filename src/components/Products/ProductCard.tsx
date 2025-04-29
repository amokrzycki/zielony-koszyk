import Product from "../../types/Product.ts";
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
      })
    );
    toast.success("Produkt zostały dodany do koszyka");
  };

  return (
    <Box
      className={
        "flex border-b-2 p-4 relative border-gray-200 flex-wrap lg:flex-nowrap justify-center"
      }
    >
      <NavLink
        to={`/produkty/${product.product_id}`}
        className={"h-full left-0 top-0 absolute w-full z-[1]"}
      />
      <img
        src={`${API_URL}/${product.image}`}
        alt="product-image"
        style={{ height: "200px" }}
      />
      <Box className={"grid w-full gap-4 lg:gap-0"}>
        <ProductInfo
          product={product}
          classNames={
            "lg:ml-4 lg:justify-self-start flex flex-col items-center lg:items-start"
          }
        />
        <Box
          className={
            "flex flex-col justify-between items-center gap-2 lg:justify-self-end z-10"
          }
        >
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
  );
}

export default ProductCard;

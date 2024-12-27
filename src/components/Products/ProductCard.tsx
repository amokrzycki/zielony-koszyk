import Product from "../../types/Product.ts";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { addItem } from "../Cart/cartSlice.ts";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAppDispatch } from "../../hooks/hooks.ts";

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
  };

  return (
    <Card>
      <CardContent
        className={"flex flex-col items-center gap-1 w-300 text-center"}
      >
        <img
          src="/images/fruits.jpeg"
          className={"h-[120px]"}
          alt="product-image"
        />
        <Typography variant="h5" component="h2">
          {product.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {product.description}
        </Typography>
        <Typography variant="body1" component="p">
          Cena: {product.price} zł
        </Typography>
        <Typography variant="body1" component="p">
          Stan: {product.stock_quantity}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body1" component="p">
            Ilość:
          </Typography>
          <TextField
            type="number"
            inputProps={{ min: "1", max: `${product.stock_quantity}` }}
            defaultValue="1"
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            size={"small"}
            sx={{ width: "70px" }}
          />
        </Box>
        <Box>
          <Button
            onClick={handleAddToCart}
            variant="contained"
            startIcon={<ShoppingCartIcon sx={{ color: "text.primary" }} />}
          >
            Dodaj do koszyka
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCard;

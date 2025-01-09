import Product from "../../types/Product.ts";
import { Box, Typography } from "@mui/material";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter.ts";
import Divider from "@mui/material/Divider";

function ProductInfo({ product }: { product: Product }) {
  return (
    <Box className={"ml-4"}>
      <Typography variant="h6" component="h2">
        {product.name}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="p">
        {product.description}
      </Typography>
      <Box className={"flex gap-2"}>
        <Typography variant="body2" color="textSecondary" component="p">
          Kategoria: {capitalizeFirstLetter(product.category)}
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body2" color="textSecondary" component="p">
          Dostępnych: {product.stock_quantity}
        </Typography>
      </Box>
      <Typography variant="body2" component="p"></Typography>
    </Box>
  );
}

export default ProductInfo;

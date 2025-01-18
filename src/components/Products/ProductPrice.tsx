import { Box, Typography } from "@mui/material";

interface ProductPriceProps {
  price: number;
  quantity: number;
}

function ProductPrice({ price, quantity }: ProductPriceProps) {
  return (
    <Box>
      {quantity > 1 ? (
        <>
          <Typography variant="h5" component="span" fontWeight={"500"}>
            {(price * quantity).toFixed(2)}
          </Typography>{" "}
          zł x {quantity} szt.
        </>
      ) : (
        <>
          <Typography variant="h5" component="span" fontWeight={"500"}>
            {price}
          </Typography>{" "}
          zł
        </>
      )}
    </Box>
  );
}

export default ProductPrice;

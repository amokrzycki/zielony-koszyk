import { useEffect, useState } from "react";
import { getProducts } from "../api.ts";
import ProductType from "../types/ProductType.ts";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";

function Products() {
  const [products, setProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setProducts(products);
    };

    fetchProducts().then(() => {
      console.log("Products fetched");
    });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "center",
        padding: 2,
      }}
    >
      {products.map((product) => (
        <Card key={product.product_id}>
          <CardContent>
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
              Kategoria: {product.category}
            </Typography>
            <Typography variant="body1" component="p">
              Stan: {product.stock_quantity}
            </Typography>
            <Box>
              <Button>Dodaj do koszyka</Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default Products;

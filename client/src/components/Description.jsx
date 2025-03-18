import React, { useState } from "react";
import { Box, Typography, IconButton, Paper, Stack, Divider, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddToCartButton from "../components/AddToCartButton";
import { useLocation } from "react-router-dom";

const Description = () => {
  // Get the product data passed from the previous page (via navigate)
  const location = useLocation();
  const { product } = location.state || {}; // Get the product object from state

  // If product is not found, show an error
  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => setQuantity((prev) => prev + 1);
  const handleRemove = () => setQuantity((prev) => Math.max(1, prev - 1));

  console.log(product.image);

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 800, margin: "auto" }}>
      <Grid container spacing={2} alignItems="center">
        {/* Left side: Image */}
        <Grid item xs={12} sm={5}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "auto", borderRadius: 8 }}
          />
        </Grid>

        {/* Right side: Description, Price, and Order */}
        <Grid item xs={12} sm={7}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            {product.description}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6" fontWeight="bold">
              ${product.price.toFixed(2)}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2} alignItems="center">
            <Stack
              direction="row"
              alignItems="center"
              sx={{ border: "1px solid gray", borderRadius: 2 }}
            >
              <IconButton onClick={handleRemove} size="small">
                <RemoveIcon />
              </IconButton>
              <Typography variant="body1" sx={{ mx: 2 }}>
                {quantity}
              </Typography>
              <IconButton onClick={handleAdd} size="small">
                <AddIcon />
              </IconButton>
            </Stack>

            <Box sx={{ p: 1, pt: 0 }}>
              <AddToCartButton product={product} quantity={quantity} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Description;
import React, { useState } from "react";
import { Box, Typography, IconButton, Paper, Stack, Divider } from "@mui/material";
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

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: "auto" }}>
      {/* Product Title */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {product.name}
      </Typography>

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", height: "auto", borderRadius: 8 }}
      />

      {/* Product Description */}
      <Typography variant="body2" color="text.secondary" paragraph>
        {product.description}
      </Typography>

      {/* Price Section */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h6" fontWeight="bold">
          ${product.price.toFixed(2)}
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Quantity Controls and Add to Cart */}
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
    </Paper>
  );
};

export default Description;

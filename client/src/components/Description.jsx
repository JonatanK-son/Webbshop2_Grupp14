import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddToCartButton from "../components/AddToCartButton";

const Description = () => {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => setQuantity((prev) => prev + 1);
  const handleRemove = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Define the product object
  const product = {
    id: 7,
    name: "Fall Limited Edition Sneakers",
    price: 125.0,
    category: "Shoes",
    image: "https://via.placeholder.com/300x200",
    description:
      "These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they’ll withstand everything the weather can offer.",
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, margin: "auto" }}>
      {/* Title */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {product.name}
      </Typography>

      {/* Description */}
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

      {/* Quantity and Add to Cart */}
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

import React, { useState } from "react";
import { Box, Typography, IconButton, Paper, Stack, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddToCartButton from "../components/AddToCartButton";
import { useLocation } from "react-router-dom";

const Description = ({ product, quantity, onAdd, onRemove }) => {

  // If product is not found, show an error
  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, margin: "auto" }}>
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
          <IconButton onClick={onRemove} size="small">
            <RemoveIcon />
          </IconButton>
          <Typography variant="body1" sx={{ mx: 2 }}>
            {quantity}
          </Typography>
          <IconButton onClick={onAdd} size="small">
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
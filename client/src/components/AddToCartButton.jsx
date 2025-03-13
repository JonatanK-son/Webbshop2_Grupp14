import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import { useCart } from "../context/CartContext";

const AddToCartButton = ({ product }) => {
  const { addToCart, toggleCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({product});
    setSnackbarMessage(`${product.name} added to cart`);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        fullWidth
        size="small"
        onClick={handleAddToCart}
        sx={{
          backgroundColor: "#000",
          "&:hover": { backgroundColor: "#333" },
          py: 0.5,
          mt: 0.5,
        }}
      >
        Add to Cart
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                toggleCart();
                setSnackbarOpen(false);
              }}
            >
              VIEW CART
            </Button>
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddToCartButton;

import React, { useState } from "react";
import { Container } from "@mui/material";
import { useLocation } from "react-router-dom";
import Description from "../components/Description";

function ProductDetails() {
  const location = useLocation();
  const product = location.state?.product; // Get product from navigation state

  if (!product) {
    return <p>Product not found</p>;
  }

  const [quant, setQuant] = useState(1);
  const addQuant = () => setQuant(quant + 1);
  const removeQuant = () => setQuant(Math.max(1, quant - 1));

  return (
    <main className="App">
      <Container component="section" maxWidth={"lg"}>
        <Description
          product={product} // Pass the product dynamically
          quantity={quant}
          onAdd={addQuant}
          onRemove={removeQuant}
        />
      </Container>
    </main>
  );
}

export default ProductDetails;

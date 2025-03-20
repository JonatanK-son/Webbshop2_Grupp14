import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import Description from "../components/Description";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const [quant, setQuant] = useState(1); // Start with 1 to avoid issues
  const [orderedQuant, setOrderedQuant] = useState(0);

  const addQuant = () => setQuant(quant + 1);
  const removeQuant = () => setQuant(Math.max(1, quant - 1)); // Prevent going below 1
  const resetQuant = () => {
    setQuant(1); // Reset to 1 or desired default quantity
    setOrderedQuant(0);
  };

  return (
    <Box component="main" sx={{ width: '100%', bgcolor: '#f5f5f5', py: 3, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Description
          onQuant={quant}
          onAdd={addQuant}
          onRemove={removeQuant}
          onSetOrderedQuant={setOrderedQuant}
        />
      </Container>
    </Box>
  );
}

export default ProductDetails;
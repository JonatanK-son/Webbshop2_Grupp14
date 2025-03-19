import React, { useState } from "react";
import { Container } from "@mui/material";
import Description from "../components/Description";
import RatingComponent from "../components/RatingComponent";
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
    <main className="App">
      <Container component="section" maxWidth={"lg"}>
        <section className="core">
          <Description
            onQuant={quant}
            onAdd={addQuant}
            onRemove={removeQuant}
            onSetOrderedQuant={setOrderedQuant}
          />
        </section>
      </Container>
      <Container component="section" maxWidth={"lg"} sx={{mt: 3}}>
        <section className="rating">
        <RatingComponent productId={id} />
        </section>
      </Container>
    </main>
  );
}

export default ProductDetails;
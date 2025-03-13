import React, { useState } from "react";
import { Container } from "@mui/material";
import Gallery from "../components/Gallery";
import Description from "../components/Description";

function ProductDetails() {
    const [quant, setQuant] = useState(0);
  const [orderedQuant, setOrderedQuant] = useState(0);

  const addQuant = () => {
    setQuant(quant + 1);
  };

  const removeQuant = () => {
    setQuant(quant - 1);
  };

  const resetQuant = () => {
    setQuant(0);
    setOrderedQuant(0);
  };
    return ( 
    <main className="App">
      <Container component="section" maxWidth={"lg"}>
        <section className="core">
{/*           <Gallery /> */}
          <Description
            onQuant={quant}
            onAdd={addQuant}
            onRemove={removeQuant}
            onSetOrderedQuant={setOrderedQuant}
          />
        </section>
      </Container>
    </main>
     );
}

export default ProductDetails;
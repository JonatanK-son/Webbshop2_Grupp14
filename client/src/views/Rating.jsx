function ProductDetails() {
    return ( <h2>ProductDetails</h2> );
}


import React, { useState } from "react";
import { Card, CardContent, Typography, Rating } from "@mui/material";

const products = [
  { id: 1, name: "Product A", rating: 4 },
  { id: 2, name: "Product B", rating: 3.5 },
  { id: 3, name: "Product C", rating: 5 },
];

const ProductRatings = () => {
  const [ratings, setRatings] = useState(
    products.reduce((acc, product) => ({ ...acc, [product.id]: product.rating }), {})
  );

  const handleRatingChange = (productId, newRating) => {
    setRatings((prev) => ({ ...prev, [productId]: newRating }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {products.map((product) => (
        <Card key={product.id} sx={{ maxWidth: 300 }}>
          <CardContent>
            <Typography variant="h6">{product.name}</Typography>
            <Rating
              value={ratings[product.id]}
              precision={0.5}
              onChange={(event, newValue) => handleRatingChange(product.id, newValue)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductRatings;

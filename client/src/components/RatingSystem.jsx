import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Rating, Button, TextField } from "@mui/material";
import ratingService from "../services/ratingService";
import { useLocation } from "react-router-dom";

const RatingComponent = ({ userId }) => {
  const [rating, setRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [comment, setComment] = useState("");
  const [ratingId, setRatingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   // Get the product data passed from the previous page (via navigate)
    const location = useLocation();
    const { product } = location.state || {}; // Get the product object from state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the user's rating for this product
        const ratings = await ratingService.getProductRatings(product.id);
        const userRating = ratings.find((r) => r.userId === userId);

        if (userRating) {
          setRating(userRating.rating);
          setComment(userRating.comment || "");
          setRatingId(userRating.id);
        }

        // Get average rating for the product
        const avgRating = await ratingService.getProductAverageRating(product.id);
        setAverageRating(avgRating.average || 0);
      } catch (err) {
        setError("Failed to load rating data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product.id, userId]);

  const handleRatingChange = async (event, newValue) => {
    try {
      setRating(newValue);

      if (!ratingId) {
        // Create new rating
        const newRating = await ratingService.addRating(product.id, userId, { rating: newValue, comment });
        setRatingId(newRating.id);
      } else {
        // Update existing rating
        await ratingService.updateRating(ratingId, { rating: newValue, comment });
      }

      // Refresh average rating
      const avgRating = await ratingService.getProductAverageRating(product.id);
      setAverageRating(avgRating.average || 0);
    } catch (err) {
      setError("Failed to update rating");
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleDelete = async () => {
    try {
      await ratingService.deleteRating(ratingId);
      setRating(null);
      setComment("");
      setRatingId(null);

      // Refresh average rating
      const avgRating = await ratingService.getProductAverageRating(product.id);
      setAverageRating(avgRating.average || 0);
    } catch (err) {
      setError("Failed to delete rating");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card sx={{ maxWidth: 400, marginBottom: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6">Product {product.id}</Typography>
        <Typography variant="body2">Average Rating: {averageRating.toFixed(1)}</Typography>
        <Rating
          value={rating || 0}
          precision={0.5}
          onChange={handleRatingChange}
        />
        <TextField
          fullWidth
          label="Leave a comment"
          multiline
          rows={2}
          value={comment}
          onChange={handleCommentChange}
          sx={{ marginTop: 2 }}
        />
        {ratingId && (
          <Button onClick={handleDelete} color="error" size="small" sx={{ marginTop: 1 }}>
            Delete Rating
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingComponent;

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ratingService } from '../services';
import { useUser } from '../context/UserContext';

const RatingComponent = ({ productId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const { currentUser } = useUser();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRating, setEditingRating] = useState(null);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    loadRatings();
  }, [productId]);

  const loadRatings = async () => {
    try {
      const productRatings = await ratingService.getProductRatings(productId);
      setRatings(productRatings);

      if (productRatings.length > 0) {
        const total = productRatings.reduce((sum, r) => sum + r.rating, 0);
        setAverageRating(total / productRatings.length);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading ratings:", error);
      setLoading(false);
    }
  };

  // 3. Implement the handleEdit function
  const handleEdit = (rating) => {
    setEditingRating(rating);
    setEditComment(rating.comment || "");
    setEditDialogOpen(true);
  };

  // 4. Implement the submitEdit function
  const submitEdit = async () => {
    try {
      await ratingService.updateRating(editingRating.id, {
        rating: editingRating.rating,
        comment: editComment.trim(),
        userId: currentUser.id,
        isAdmin: currentUser.isAdmin,
      });
      setEditDialogOpen(false);
      await loadRatings();
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review. Please try again.");
    }
  };

  // 5. Implement the handleDelete function
  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        console.log("Deleting review:", reviewId, "User ID:", currentUser.id); // Debugging log

        await ratingService.deleteRating(reviewId, {
          userId: currentUser.id, // ✅ Ensure userId is sent
        });

        await loadRatings();
      } catch (error) {
        console.error("Error deleting review:", error);
        alert(error.response?.data?.error || "Failed to delete review.");
      }
    }
  };


  const handleSubmitRating = async () => {
    if (!userRating) {
      alert("Please select a rating");
      return;
    }

    try {
      await ratingService.addRating(productId, currentUser.id, {
        rating: userRating,
        comment: comment.trim(),
      });

      setUserRating(0);
      setComment("");
      setOpenDialog(false);
      await loadRatings(); // Reload ratings after successful submission
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert(
        error.response?.data?.error ||
          "Failed to submit rating. Please try again."
      );
    }
  };

  const handleOpenDialog = () => {
    if (!currentUser) {
      alert("Please login to rate this product");
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserRating(0);
    setComment("");
  };

  if (loading) {
    return <Typography>Loading ratings...</Typography>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: "auto" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Product Ratings
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Rating value={averageRating} precision={0.5} readOnly size="large" />
          <Typography variant="h6" sx={{ ml: 1 }}>
            {averageRating.toFixed(1)}
          </Typography>
          <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
            ({ratings.length} {ratings.length === 1 ? "review" : "reviews"})
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleOpenDialog} sx={{ mt: 1 }}>
          Write a Review
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating
                value={userRating}
                onChange={(event, newValue) => setUserRating(newValue)}
                size="large"
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {userRating > 0 ? `${userRating} stars` : "Select rating"}
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your thoughts about this product (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitRating}
            variant="contained"
            disabled={!userRating}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      <List>
        {ratings.map((rating, index) => (
          <React.Fragment key={rating.id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Rating value={rating.rating} readOnly size="small" />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, color: "text.secondary" }}
                    >
                      by {rating.user ? rating.user.username : "Anonymous"}
                    </Typography>
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {rating.comment ? rating.comment : ""}
                    </Typography>
                    {rating.updatedAt !== rating.createdAt && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        (Edited)
                      </Typography>
                    )}
                  </React.Fragment>
                }
              />
              {(currentUser?.id === rating.userId || currentUser?.isAdmin) && (
                <Box sx={{ ml: 2 }}>
                  <Button size="small" onClick={() => handleEdit(rating)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(rating.id)}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </ListItem>
            {index < ratings.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        {ratings.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            No reviews yet. Be the first to review this product!
          </Typography>
        )}
      </List>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating
                value={editingRating?.rating || 0}
                onChange={(event, newValue) =>
                  setEditingRating({ ...editingRating, rating: newValue })
                }
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Edit your comment"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RatingComponent; 
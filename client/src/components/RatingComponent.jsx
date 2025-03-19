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
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const { currentUser } = useUser();

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
      console.error('Error loading ratings:', error);
      setLoading(false);
    }
  };

  const handleSubmitRating = async () => {
    if (!userRating) {
      alert('Please select a rating');
      return;
    }

    try {
      await ratingService.addRating(productId, currentUser.id, {
        rating: userRating,
        comment: comment.trim()
      });
      
      setUserRating(0);
      setComment('');
      setOpenDialog(false);
      await loadRatings(); // Reload ratings after successful submission
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error.response?.data?.error || 'Failed to submit rating. Please try again.');
    }
  };

  const handleOpenDialog = () => {
    if (!currentUser) {
      alert('Please login to rate this product');
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUserRating(0);
    setComment('');
  };

  if (loading) {
    return <Typography>Loading ratings...</Typography>;
  }

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Product Ratings
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={averageRating} 
            precision={0.5} 
            readOnly 
            size="large"
          />
          <Typography variant="h6" sx={{ ml: 1 }}>
            {averageRating.toFixed(1)}
          </Typography>
          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
            ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={handleOpenDialog}
          sx={{ mt: 1 }}
        >
          Write a Review
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={userRating}
                onChange={(event, newValue) => setUserRating(newValue)}
                size="large"
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {userRating > 0 ? `${userRating} stars` : 'Select rating'}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={rating.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                      by User {rating.userId}
                    </Typography>
                  </Box>
                }
                secondary={rating.comment || 'No comment provided'}
              />
            </ListItem>
            {index < ratings.length - 1 && <Divider />}
          </React.Fragment>
        ))}
        {ratings.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No reviews yet. Be the first to review this product!
          </Typography>
        )}
      </List>
    </Paper>
  );
};

export default RatingComponent; 
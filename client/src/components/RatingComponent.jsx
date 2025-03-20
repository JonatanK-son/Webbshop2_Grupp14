import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  Button, 
  TextField, 
  List, 
  ListItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Avatar,
  Chip
} from '@mui/material';
import { ratingService } from '../services';
import { useUser } from '../context/UserContext';
import StarIcon from '@mui/icons-material/Star';

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
    return <Typography variant="body2">Loading ratings...</Typography>;
  }

  return (
    <Box sx={{ width: '100%', px: 0 }}>
      {/* Compact Header with Rating Summary */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h5" component="div" fontWeight="bold" color="primary">
            {averageRating > 0 ? averageRating.toFixed(1) : '-'}
          </Typography>
          <Rating 
            value={averageRating} 
            precision={0.5} 
            readOnly 
            size="small"
          />
          <Chip 
            label={`${ratings.length} ${ratings.length === 1 ? 'review' : 'reviews'}`} 
            size="small" 
            variant="outlined"
          />
        </Stack>
        
        <Button 
          variant="contained" 
          onClick={handleOpenDialog}
          startIcon={<StarIcon />}
          size="small"
        >
          Write a Review
        </Button>
      </Box>

      {/* Reviews List - More Compact */}
      {ratings.length > 0 ? (
        <List disablePadding sx={{ width: '100%' }}>
          {ratings.map((rating, index) => (
            <React.Fragment key={rating.id}>
              <ListItem alignItems="flex-start" disableGutters sx={{ px: 0 }}>
                <Stack direction="row" spacing={1.5} width="100%">
                  <Avatar 
                    sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                  >
                    {(rating.user?.username?.[0] || 'A').toUpperCase()}
                  </Avatar>
                  <Box flex={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle2" mr={1} fontSize="0.85rem">
                        {rating.user ? rating.user.username : 'Anonymous'}
                      </Typography>
                      <Rating value={rating.rating} readOnly size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                      {rating.comment || 'No comment provided'}
                    </Typography>
                  </Box>
                </Stack>
              </ListItem>
              {index < ratings.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ py: 1, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No reviews yet. Be the first to review this product!
          </Typography>
        </Box>
      )}

      {/* Review Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
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
    </Box>
  );
};

export default RatingComponent; 
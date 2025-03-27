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
  const handleDelete = async (rating) => {
    try {
      console.log("Deleting review:", rating.id, "User ID:", currentUser.id); // Debugging log

      await ratingService.deleteRating(rating.id, currentUser.id);

      await loadRatings();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(error.response?.data?.error || "Failed to delete review.");
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
      await loadRatings();
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
    return <Typography variant="body2">Loading ratings...</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        mb: 2,
        pb: 2,
        borderBottom: '1px solid #eee'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mr: 2, 
            pr: 2, 
            borderRight: '1px solid #eee' 
          }}>
            <Typography variant="h4" component="div" fontWeight="bold" color="primary">
              {averageRating > 0 ? averageRating.toFixed(1) : '-'}
            </Typography>
            <Rating 
              value={averageRating} 
              precision={0.5} 
              readOnly 
              size="small"
            />
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Based on {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Share your thoughts with other customers
            </Typography>
          </Box>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={handleOpenDialog}
          startIcon={<StarIcon />}
          size="small"
        >
          Write a Review
        </Button>
      </Box>

      {ratings.length > 0 ? (
        <List disablePadding>
          {ratings.map((rating, index) => (
            <React.Fragment key={rating.id}>
              <ListItem alignItems="flex-start" disableGutters sx={{ px: 0, py: 1 }}>
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
                      {rating.updatedAt !== rating.createdAt && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          (Edited)
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                      {rating.comment || 'No comment provided'}
                    </Typography>
                    
                    {/* Edit and Delete buttons from HEAD */}
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      {currentUser?.id === rating.userId && (
                        <Button size="small" onClick={() => handleEdit(rating)} sx={{ minWidth: 0, py: 0 }}>
                          Edit
                        </Button>
                      )}
                      {(currentUser?.id === rating.userId ||
                        currentUser?.role === "admin") && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(rating)}
                          sx={{ minWidth: 0, py: 0 }}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Stack>
              </ListItem>
              {index < ratings.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ py: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 1, bgcolor: '#f9f9f9', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            No reviews yet.
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleOpenDialog}
            startIcon={<StarIcon />}
          >
            Be the first to review this product
          </Button>
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

      {/* Edit Review Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
    </Box>
  );
};

export default RatingComponent;

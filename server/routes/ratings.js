const express = require('express');
const router = express.Router();
const ratingService = require('../services/ratingService');

// Get all ratings for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const productRatings = await ratingService.getProductRatings(req.params.productId);
    res.json(productRatings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's ratings
router.get('/user/:userId', async (req, res) => {
  try {
    const userRatings = await ratingService.getUserRatings(req.params.userId);
    res.json(userRatings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new rating
router.post('/', async (req, res) => {
  try {
    const newRating = await ratingService.createRating(req.body);
    res.status(201).json(newRating);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a rating
router.put('/:id', async (req, res) => {
  try {
    const rating = await ratingService.updateRating(req.params.id, req.body);
    res.json(rating);
  } catch (error) {
    if (error.message === 'Rating not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Delete a rating
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body; // ✅ Extract userId from request body
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await ratingService.deleteRating(req.params.id, userId); // ✅ Pass userId
    res.status(204).end();
  } catch (error) {
    if (error.message === "Rating not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(403).json({ error: error.message }); // Change to 403 for permission errors
    }
  }
});


// Add this new route
router.get('/product/:productId/average', async (req, res) => {
  try {
    const ratings = await ratingService.getProductRatings(req.params.productId);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;
    res.json(averageRating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update the route for creating a new rating
router.post('/product/:productId', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    if (!userId || !rating || !rating.rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newRating = await ratingService.createRating({
      productId: parseInt(req.params.productId),
      userId: parseInt(userId),
      rating: rating.rating,
      comment: rating.comment
    });
    res.status(201).json(newRating);
  } catch (error) {
    console.error('Error creating rating:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 
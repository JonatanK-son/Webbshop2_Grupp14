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
router.delete('/:id', async (req, res) => {
  try {
    await ratingService.deleteRating(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Rating not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router; 
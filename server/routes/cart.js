const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');

// Get user's cart
router.get('/:userId', async (req, res) => {
  try {
    const userCart = await cartService.getUserCart(req.params.userId);
    res.json(userCart);
  } catch (error) {
    if (error.message === 'Cart not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Add item to cart
router.post('/:userId/items', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cartItem = await cartService.addItemToCart(req.params.userId, productId, quantity);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update cart item quantity
router.put('/:userId/items/:itemId', async (req, res) => {
  try {
    const cartItem = await cartService.updateCartItem(req.params.itemId, req.body.quantity);
    res.json(cartItem);
  } catch (error) {
    if (error.message === 'Cart item not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Remove item from cart
router.delete('/:userId/items/:itemId', async (req, res) => {
  try {
    await cartService.removeCartItem(req.params.itemId);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Cart item not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Clear cart
router.delete('/:userId', async (req, res) => {
  try {
    await cartService.clearCart(req.params.userId);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Cart not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router; 
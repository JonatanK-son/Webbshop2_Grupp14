const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');
const { authenticateUser } = require('../middlewares/auth');

// Get user's cart - authentication optional
router.get('/:userId', async (req, res) => {
  try {
    const userCart = await cartService.getUserCart(req.params.userId);
    res.json(userCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart - authentication optional
router.post('/:userId/items', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const cartItem = await cartService.addItemToCart(req.params.userId, productId, quantity);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update cart item quantity - authentication optional
router.put('/:userId/items/:itemId', async (req, res) => {
  try {
    const cartItem = await cartService.updateCartItem(req.params.itemId, req.body.quantity);
    
    // If quantity was zero or less, item was removed
    if (!cartItem) {
      return res.status(204).end();
    }
    
    res.json(cartItem);
  } catch (error) {
    if (error.message === 'Cart item not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Remove item from cart - authentication optional
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

// Clear cart - authentication optional
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

// Checkout - requires authentication
router.post('/:userId/checkout', authenticateUser, async (req, res) => {
  try {
    // Make sure users can only checkout their own cart
    if (req.user.id !== parseInt(req.params.userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const completedOrder = await cartService.checkout(req.params.userId);
    res.json(completedOrder);
  } catch (error) {
    if (error.message === 'Cart not found' || error.message === 'Cannot checkout empty cart') {
      res.status(400).json({ message: error.message });
    } else if (error.message === 'Cart is already paid') {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router; 
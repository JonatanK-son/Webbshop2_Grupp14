const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const { authenticateUser, requireAdmin } = require('../middlewares/auth');

// Get all orders (admin only)
router.get('/', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const orders = await orderService.getAllOrders(page, limit);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's orders
router.get('/user/:userId', authenticateUser, async (req, res) => {
  try {
    // Ensure users can only access their own orders
    if (req.user.id !== parseInt(req.params.userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const orders = await orderService.getOrdersByUser(req.params.userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    
    // Ensure users can only access their own orders
    if (req.user.id !== order.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(order);
  } catch (error) {
    if (error.message === 'Order not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Create a new order
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { userId, cartId, shippingAddress } = req.body;
    
    // Ensure users can only create orders for themselves
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const newOrder = await orderService.createOrder(userId, cartId, shippingAddress);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(req.params.id, status);
    res.json(updatedOrder);
  } catch (error) {
    if (error.message === 'Order not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Update shipping information (admin only)
router.put('/:id/shipping', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    const updatedOrder = await orderService.updateShippingInfo(req.params.id, trackingNumber);
    res.json(updatedOrder);
  } catch (error) {
    if (error.message === 'Order not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Cancel order
router.put('/:id/cancel', authenticateUser, async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    
    // Ensure users can only cancel their own orders
    if (req.user.id !== order.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const cancelledOrder = await orderService.cancelOrder(req.params.id);
    res.json(cancelledOrder);
  } catch (error) {
    if (error.message === 'Order not found') {
      res.status(404).json({ message: error.message });
    } else if (error.message.includes('Cannot cancel order')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router; 
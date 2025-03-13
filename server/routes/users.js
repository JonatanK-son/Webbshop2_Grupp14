const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// Login user
router.post('/login', async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const allUsers = await userService.getAllUsers();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Create a new user (register)
router.post('/register', async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create admin user (only for development or initial setup)
router.post('/create-admin', async (req, res) => {
  try {
    const adminUser = await userService.createAdminUser(req.body);
    res.status(201).json(adminUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'User not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router; 
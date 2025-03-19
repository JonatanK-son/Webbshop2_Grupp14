const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const ratingService = require('../services/ratingService');

// Get all products
router.get('/', async (req, res) => {
  try {
    const allProducts = await productService.getAllProducts();
    const productsWithRatings = await Promise.all(allProducts.map(async (product) => {
      try {
        const ratings = await ratingService.getProductRatings(product.id);
        const averageRating = ratings && ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;
        return {
          ...product.toJSON(),
          averageRating
        };
      } catch (error) {
        console.error(`Error getting ratings for product ${product.id}:`, error);
        // If there's an error getting ratings, return product with 0 rating
        return {
          ...product.toJSON(),
          averageRating: 0
        };
      }
    }));
    res.json(productsWithRatings);
  } catch (error) {
    console.error('Error in products route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

module.exports = router; 
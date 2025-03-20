const express = require('express');
const { deleteImage } = require('../services/deleteImageService');
const router = express.Router();

router.post('/delete-image', async (req, res) => {
    try {
        const { product } = req.body;
        if (!product) {
            return res.status(400).json({ error: 'Missing product information' });
        }

        await deleteImage(product);
        res.status(200).json({ message: 'Image deleted' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

module.exports = router;
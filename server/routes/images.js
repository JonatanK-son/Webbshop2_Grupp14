const express = require('express');
const { getImageFromCache } = require('../services/GeminiService');
const router = express.Router();

// Route to serve images from the cache
router.get('/:imageId', (req, res) => {
    const { imageId } = req.params;
    const imageData = getImageFromCache(imageId);
    
    if (!imageData) {
        return res.status(404).json({ error: 'Image not found' });
    }
    
    // Set the content type based on the stored mime type
    res.setHeader('Content-Type', imageData.mimeType);
    
    // Send the raw base64-decoded image data
    const buffer = Buffer.from(imageData.data, 'base64');
    res.send(buffer);
});

module.exports = router; 
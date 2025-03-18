const express = require('express');
const { generateImage } = require('../services/geminiService'); // Import the function
const router = express.Router();

router.post('/generate-image', async (req, res) => {
    try {
        const { product } = req.body;
        if (!product) {
            return res.status(400).json({ error: 'Missing product information' });
        }

        await generateImage(product);
        res.status(200).json({ message: 'Image generation started' });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

module.exports = router;
const express = require('express');
const { generateImage } = require('../services/GeminiService');
const productService = require('../services/productService');
const router = express.Router();

router.post('/generate-image', async (req, res) => {
    try {
        const { product } = req.body;
        if (!product) {
            return res.status(400).json({ error: 'Missing product information' });
        }

        // Generate the image and get the URL for accessing it
        const imageUrl = await generateImage(product);
        
        // Only update the product if we got a valid URL back
        if (imageUrl) {
            // Update the product in the database with the image URL
            await productService.updateProduct(product.id, { 
                image: imageUrl 
            });
            res.status(200).json({ 
                message: 'Image generated and product updated successfully',
                imageUrl: imageUrl
            });
        } else {
            res.status(500).json({ error: 'Failed to generate image' });
        }
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

module.exports = router;
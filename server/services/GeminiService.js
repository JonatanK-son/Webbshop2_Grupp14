import { GoogleGenerativeAI } from "@google/generative-ai"; // Correct import
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory storage for generated images
const imageCache = new Map();

async function generateImage(product) {
    const contents = `Hi, please generate an image of ${product.description}`;

  // Set responseModalities to include "Image" so the model can generate an image
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
        responseModalities: ['Text', 'Image']
    },
  });

  try {
    const response = await model.generateContent(contents);
    for (const part of response.response.candidates[0].content.parts) {
      // Based on the part type, either show the text or store the image data
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        
        // Generate a unique ID for the image
        const imageId = `${product.id}_${Date.now()}`;
        
        // Store the image data in our cache
        imageCache.set(imageId, {
          data: imageData,
          mimeType: mimeType
        });
        
        // Return the URL that will serve this image
        return `http://localhost:5000/api/images/${imageId}`;
      }
    }
    return null; // Return null if no image was generated
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
}

// Function to get an image from the cache
function getImageFromCache(imageId) {
  return imageCache.get(imageId);
}

export { generateImage, getImageFromCache };
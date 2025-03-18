import { GoogleGenerativeAI } from "@google/generative-ai"; // Correct import
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage( product ) {

    const contents = `Hi, please generate an image of ${product.description}`;

  // Set responseModalities to include "Image" so the model can generate  an image
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
        responseModalities: ['Text', 'Image']
    },
  });

  try {
    const response = await model.generateContent(contents);
    for (const part of  response.response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        fs.writeFileSync(`./images/${product.name}.png`, buffer);
        console.log(`Image saved as ${product.name}.png`);
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export { generateImage };
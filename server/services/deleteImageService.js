const fs = require('fs');
const path = require('path');

async function deleteImage(product) {
  const imagePath = path.join('./images', `${product.name}.png`);
  
  // Check if file exists before trying to delete it
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, just log and continue
      console.log(`Image file ${imagePath} doesn't exist, skipping deletion`);
      return;
    }
    
    // File exists, delete it
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Error deleting image ${imagePath}:`, err);
      } else {
        console.log(`Successfully deleted image: ${imagePath}`);
      }
    });
  });
}

module.exports = { deleteImage };

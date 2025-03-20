import { unlink } from "node:fs";

async function deleteImage(product) {
  unlink(`./images/${product.name}.png`, (err) => {
    if (err) throw err;
    console.log(`./images/${product.name}.png`);
  });
}

export { deleteImage };

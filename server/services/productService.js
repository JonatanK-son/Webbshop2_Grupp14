const { products } = require('../models');

class ProductService {
  async getAllProducts() {
    return await products.findAll();
  }

  async getProductById(id) {
    const product = await products.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(productData) {
    return await products.create(productData);
  }

  async updateProduct(id, productData) {
    const product = await this.getProductById(id);
    return await product.update(productData);
  }

  async deleteProduct(id) {
    const product = await this.getProductById(id);
    await product.destroy();
    return true;
  }
}

module.exports = new ProductService(); 
const { products, sequelize } = require('../models');

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
    try {
      // Start a transaction to ensure data integrity
      const transaction = await sequelize.transaction();

      try {
        // First, delete any cart_rows that reference this product
        await sequelize.query(
          `DELETE FROM cart_rows WHERE productId = :productId`,
          {
            replacements: { productId: id },
            transaction
          }
        );
        
        // Then delete the product itself
        const product = await this.getProductById(id);
        await product.destroy({ transaction });
        
        // If everything succeeds, commit the transaction
        await transaction.commit();
        return true;
      } catch (error) {
        // If anything fails, roll back the transaction
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new ProductService(); 
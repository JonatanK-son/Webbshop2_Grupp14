import api from './api';

const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get a single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new product (admin function)
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update a product (admin function)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a product (admin function)
  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }
};

export default productService; 
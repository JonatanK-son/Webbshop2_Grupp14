import api from './api';

const cartService = {
  // Get user's cart
  getCart: async (userId) => {
    try {
      const response = await api.get(`/cart/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (userId, productId, quantity = 1) => {
    try {
      const response = await api.post(`/cart/${userId}/items`, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (userId, productId, quantity) => {
    try {
      const response = await api.put(`/cart/${userId}/items/${productId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (userId, productId) => {
    try {
      await api.delete(`/cart/${userId}/items/${productId}`);
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async (userId) => {
    try {
      await api.delete(`/cart/${userId}`);
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
};

export default cartService; 
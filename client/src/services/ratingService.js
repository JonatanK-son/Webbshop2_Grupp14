import api from './api';

const ratingService = {
  // Get all ratings for a product
  getProductRatings: async (productId) => {
    try {
      const response = await api.get(`/ratings/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ratings for product ${productId}:`, error);
      throw error;
    }
  },

  // Get average rating for a product
  getProductAverageRating: async (productId) => {
    try {
      const response = await api.get(`/ratings/product/${productId}/average`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching average rating for product ${productId}:`, error);
      throw error;
    }
  },

  // Add a rating for a product
  addRating: async (productId, userId, ratingData) => {
    try {
      const response = await api.post(`/ratings/product/${productId}`, {
        userId,
        rating: ratingData.rating,
        comment: ratingData.comment
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding rating for product ${productId}:`, error);
      throw error;
    }
  },

  // Update a rating
  updateRating: async (ratingId, ratingData) => {
    try {
      const response = await api.put(`/ratings/${ratingId}`, ratingData);
      return response.data;
    } catch (error) {
      console.error(`Error updating rating ${ratingId}:`, error);
      throw error;
    }
  },

  // Delete a rating
  deleteRating: async (ratingId) => {
    try {
      await api.delete(`/ratings/${ratingId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting rating ${ratingId}:`, error);
      throw error;
    }
  }
};

export default ratingService; 
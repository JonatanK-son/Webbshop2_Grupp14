const { ratings, users } = require('../models');

class RatingService {
  async getProductRatings(productId) {
    try {
      return await ratings.findAll({
        where: { productId },
        include: [{
          model: users,
          as: 'user',
          attributes: ['username', 'email'] // Only include necessary user fields
        }],
        order: [['createdAt', 'DESC']] // Show newest ratings first
      });
    } catch (error) {
      console.error(`Error getting ratings for product ${productId}:`, error);
      return []; // Return empty array if there's an error
    }
  }

  async getUserRatings(userId) {
    return await ratings.findAll({
      where: { userId }
    });
  }

  async createRating(ratingData) {
    return await ratings.create(ratingData);
  }

  async updateRating(id, ratingData) {
    const rating = await ratings.findByPk(id);
    if (!rating) {
      throw new Error('Rating not found');
    }
    
    return await rating.update(ratingData);
  }

  async deleteRating(id) {
    const rating = await ratings.findByPk(id);
    if (!rating) {
      throw new Error('Rating not found');
    }
    
    await rating.destroy();
    return true;
  }
}

module.exports = new RatingService(); 
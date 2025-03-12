const { ratings } = require('../models');

class RatingService {
  async getProductRatings(productId) {
    return await ratings.findAll({
      where: { productId }
    });
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
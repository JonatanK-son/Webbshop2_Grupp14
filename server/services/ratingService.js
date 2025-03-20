const { ratings, users } = require('../models');

class RatingService {
  async getProductRatings(productId) {
    try {
      return await ratings.findAll({
        where: { productId },
        include: [
          {
            model: users,
            as: "user",
            attributes: ["username", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error(`Error getting ratings for product ${productId}:`, error);
      return [];
    }
  }

  async getUserRatings(userId) {
    return await ratings.findAll({
      where: { userId },
    });
  }

  async createRating(ratingData) {
    if (!ratingData.comment || ratingData.comment.trim() === "") {
      ratingData.comment = null;
    }
    const existingReview = await ratings.findOne({
      where: {
        userId: ratingData.userId,
        productId: ratingData.productId,
      },
    });
    if (existingReview) {
      throw new Error("You have already submitted a review for this product.");
    }
    return await ratings.create(ratingData);
  }

  async updateRating(id, { rating, comment, userId }) {
    const review = await ratings.findByPk(id);

    if (!review) {
      throw new Error("Rating not found");
    }

    if (review.userId !== userId) {
      throw new Error("You do not have permission to edit this review");
    }

    review.rating = rating;
    review.comment = comment && comment.trim() !== "" ? comment : null;
    review.updatedAt = new Date();

    await review.save();
    return review;
  }

  async deleteRating(id, userId) {
    const review = await ratings.findByPk(id);

    if (!review) {
      throw new Error("Rating not found");
    }

    if (review.userId !== userId && userId !== 1) {
      throw new Error("You do not have permission to delete this review.");
    }

    await review.destroy();
    return true;
  }
}

module.exports = new RatingService(); 
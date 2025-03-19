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
            attributes: ["username", "email"], // Only include necessary user fields
          },
        ],
        order: [["createdAt", "DESC"]], // Show newest ratings first
      });
    } catch (error) {
      console.error(`Error getting ratings for product ${productId}:`, error);
      return []; // Return empty array if there's an error
    }
  }

  async getUserRatings(userId) {
    return await ratings.findAll({
      where: { userId },
    });
  }

  async createRating(ratingData) {
    // Ensure empty comments are stored as null
    if (!ratingData.comment || ratingData.comment.trim() === "") {
      ratingData.comment = null;
    }
    return await ratings.create(ratingData);
  }

  async updateRating(id, { rating, comment, userId, isAdmin }) {
    const review = await ratings.findByPk(id);

    if (!review) {
      throw new Error("Rating not found");
    }

    // Check permission: Only the owner or an admin can edit
    if (review.userId !== userId && !isAdmin) {
      throw new Error("You do not have permission to edit this review");
    }

    // Prevent "No comment provided" by storing empty comments as null
    review.rating = rating;
    review.comment = comment && comment.trim() !== "" ? comment : null;
    review.updatedAt = new Date(); // Mark as edited

    await review.save();
    return review;
  }

  async deleteRating(id, userId, isAdmin) {
    const review = await ratings.findByPk(id);

    if (!review) {
      throw new Error("Rating not found");
    }

    // Check permission: Only the owner or an admin can delete
    if (review.userId !== userId && !isAdmin) {
      throw new Error("You do not have permission to delete this review");
    }

    await review.destroy();
    return true;
  }
}

module.exports = new RatingService(); 
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("ratings", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.users, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Rating;
};

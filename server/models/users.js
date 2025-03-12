module.exports = (sequelize, DataTypes) => {
  return sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(200), // Vet inte om det är rätt
      allowNull: false,
      validate: {
        len: [4, 200],
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    firstName: DataTypes.STRING(50),

    lastName: DataTypes.STRING(50),

    description: DataTypes.TEXT,
    
    imageUrl: {
      type: DataTypes.STRING(255),
      validate: {
        isUrl: true
      }
    }
  });
};

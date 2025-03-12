module.exports = (sequelize, DataTypes) => {
  return sequelize.define("ratings", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  });
};

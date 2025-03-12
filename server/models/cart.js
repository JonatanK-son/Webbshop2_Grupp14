module.exports = (sequelize, DataTypes) => {
  return sequelize.define("cart", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    totalPris: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  });
};

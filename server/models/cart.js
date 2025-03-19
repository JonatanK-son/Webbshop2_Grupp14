module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("cart", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    totalPris: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
  });

  Cart.associate = function(models) {
    // Cart belongs to a user
    Cart.belongsTo(models.users, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });

    // Cart has many cart_rows
    Cart.hasMany(models.cart_row, {
      foreignKey: {
        name: 'cartId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return Cart;
};

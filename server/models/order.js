module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("order", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('shippingAddress');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value) {
        this.setDataValue('shippingAddress', JSON.stringify(value));
      }
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    totalAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    trackingNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Order.associate = function(models) {
    // Order belongs to a user
    Order.belongsTo(models.users, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });

    // Order belongs to a cart
    Order.belongsTo(models.cart, {
      foreignKey: {
        name: 'cartId',
        allowNull: false
      },
      onDelete: 'CASCADE'
    });
  };

  return Order;
}; 
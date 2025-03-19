module.exports = (sequelize, DataTypes) => {
    const CartRow = sequelize.define(
        'cart_row', 
        {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        },
        amount: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        }
    });

    CartRow.associate = function(models) {
        // CartRow belongs to a cart
        CartRow.belongsTo(models.cart, {
            foreignKey: {
                name: 'cartId',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });

        // CartRow belongs to a product
        CartRow.belongsTo(models.products, {
            foreignKey: {
                name: 'productId',
                allowNull: false
            },
            onDelete: 'CASCADE'
        });
    };

    return CartRow;
}
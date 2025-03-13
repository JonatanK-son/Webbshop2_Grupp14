module.exports = (sequelize, DataTypes) => {
    return sequelize.define("products", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                len: [2, 100]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING(255)
        }
    });
}
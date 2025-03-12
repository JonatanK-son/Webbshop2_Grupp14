module.exports = (sequelize, DataTypes) => {
    return sequelize.define("products", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        created_at: {
            type: DataTypes.DATE, 
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING(255)
        }
    });
}
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("product", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    })
}
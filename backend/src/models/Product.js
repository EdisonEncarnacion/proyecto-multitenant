const { DataTypes } = require('sequelize');

const ProductModel = (sequelize) => {
  return sequelize.define('Product', {
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    stock: DataTypes.INTEGER,
  }, {
    tableName: 'products',
    timestamps: false
  });
};

module.exports = ProductModel;

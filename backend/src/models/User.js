const { DataTypes } = require('sequelize');

const UserModel = (sequelize) => {
  return sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password_hash: DataTypes.STRING,
    role: DataTypes.STRING, // admin, empleado, etc.
  }, {
    tableName: 'users',
    timestamps: false,
  });
};

module.exports = UserModel;

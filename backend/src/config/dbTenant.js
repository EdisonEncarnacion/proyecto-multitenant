// src/config/dbTenant.js
const { Sequelize } = require('sequelize');

const connectToTenant = (dbName, dbUser, dbPassword) => {
  return new Sequelize(dbName, dbUser, dbPassword, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  });
};

module.exports = connectToTenant;

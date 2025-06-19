// src/config/dbAdmin.js
const { Sequelize } = require('sequelize');

const adminDB = new Sequelize('multitenant_admin', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

module.exports = adminDB;

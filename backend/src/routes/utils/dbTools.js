const mysql = require('mysql2/promise');

async function crearBaseDeDatos(tenant) {
  const dbName = `${tenant}_db`;
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.query(`USE \`${dbName}\``);

  // Tabla de usuarios
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL
    )
  `);

  // ✅ Tabla de productos
  await connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock INT NOT NULL
    )
  `);

  await connection.end();
}

module.exports = { crearBaseDeDatos };

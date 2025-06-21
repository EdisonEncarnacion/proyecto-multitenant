// routes/auth.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Crea la BD y tabla de un tenant
async function crearBaseDeDatos(tenant) {
  const dbName = `${tenant}_db`;
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.query(`USE \`${dbName}\``);
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(100) NOT NULL,
      role VARCHAR(50) NOT NULL
    )
  `);
  await connection.end();
}

// REGISTRO
router.post('/register', async (req, res) => {
  const { tenant, name, email, password, role } = req.body;
  if (!tenant || !name || !email || !password || !role) {
    return res.status(400).json({
      error: 'Faltan campos: tenant, name, email, password y role son requeridos.'
    });
  }

  try {
    // ⚠️ No se vuelve a insertar el tenant si ya existe, eso se hace en /api/tenants
    await crearBaseDeDatos(tenant);

    const dbName = `${tenant}_db`;
    const tenantDb = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: dbName
    });

    const [existing] = await tenantDb.query(
      'SELECT 1 FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      await tenantDb.end();
      return res.status(400).json({ error: 'Correo ya registrado en esta empresa.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [insertResult] = await tenantDb.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [name, email, hashed, role]
    );

    const [newRows] = await tenantDb.query(
      `SELECT id, name, email, role FROM users WHERE id = ?`,
      [insertResult.insertId]
    );

    await tenantDb.end();

    const user = newRows[0];
    res.json({
      mensaje: 'Usuario registrado correctamente.',
      user
    });

  } catch (err) {
    console.error('Error al registrar:', err);
    res.status(500).json({ error: err.message || 'Error interno del servidor.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const tenant = req.headers.tenant;

  if (!tenant || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos de login.' });
  }

  const dbName = `${tenant}_db`;

  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: dbName
    });

    const [rows] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      await connection.end();
      return res.status(401).json({ error: 'Correo no registrado.' });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      await connection.end();
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    await connection.end();

    // ⚠️ Aquí podrías generar un JWT en lugar de 'abc123'
    const token = 'abc123';

    res.json({
      mensaje: 'Login correcto',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error de servidor al iniciar sesión.' });
  }
});

module.exports = router;

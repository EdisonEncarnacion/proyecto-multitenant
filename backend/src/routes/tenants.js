// routes/tenants.js
const express = require('express');
const router  = express.Router();
const mysql   = require('mysql2/promise');
const { crearBaseDeDatos } = require('./utils/dbTools');

// 🛠 Ajusta aquí el nombre de tu BD central
const systemDb = mysql.createPool({
  host:     'localhost',
  user:     'root',
  password: '',
  database: 'multitenant_admin'
});

// GET /api/tenants → lista de nombres
router.get('/', async (req, res) => {
  try {
    const [rows] = await systemDb.query('SELECT name FROM tenants');
    const names = rows.map(r => r.name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al leer tenants' });
  }
});

router.post('/', async (req, res) => {
  const { name, adminName, adminEmail, adminPassword } = req.body;
  if (!name || !adminName || !adminEmail || !adminPassword) {
    return res.status(400).json({ error: 'Faltan campos para la empresa o el admin' });
  }

  try {
    const [rows] = await systemDb.query('SELECT 1 FROM tenants WHERE name = ?', [name]);
    if (rows.length === 0) {
      await systemDb.query(
        `INSERT INTO tenants (name, db_name, db_user, db_password)
         VALUES (?, ?, ?, ?)`,
        [name, `${name}_db`, 'root', '']
      );

      // Crear la base de datos con sus tablas
      await crearBaseDeDatos(name);

      // Insertar primer usuario admin en la nueva base de datos
      const dbName = `${name}_db`;
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: dbName
      });

      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(adminPassword, 10);
      await conn.query(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `, [adminName, adminEmail, hash, 'admin']);

      await conn.end();
    }

    res.json({ mensaje: 'Empresa y admin registrados correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear empresa y usuario admin' });
  }
});




module.exports = router;

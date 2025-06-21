// routes/tenants.js
const express = require('express');
const router  = express.Router();
const mysql   = require('mysql2/promise');

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

// POST /api/tenants
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Falta campo name' });

  try {
    // Verificar si ya existe
    const [rows] = await systemDb.query('SELECT 1 FROM tenants WHERE name = ?', [name]);
    if (rows.length === 0) {
      await systemDb.query(
        `INSERT INTO tenants (name, db_name, db_user, db_password)
         VALUES (?, ?, ?, ?)`,
        [name, `${name}_db`, 'root', '']
      );
    }

    res.json({ mensaje: 'Tenant asegurado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear tenant' });
  }
});


module.exports = router;

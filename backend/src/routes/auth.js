const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const useTenant = require('../middleware/tenant');
const UserModel = require('../models/User');

const JWT_SECRET = 'secreto123'; // cambia esto luego

router.use(useTenant);

// Registro
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const User = UserModel(req.db);
  await req.db.sync();

  const password_hash = await bcrypt.hash(password, 10);
  try {
    const newUser = await User.create({ name, email, password_hash, role });
    res.json({ mensaje: 'Usuario registrado', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const User = UserModel(req.db);

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
  res.json({ token, user });
});

module.exports = router;

// src/tools/createUser.js
const connectToTenant = require('../config/dbTenant');
const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');

const db = connectToTenant('empresa_b_db', 'root', ''); // Ajusta si usas otra contraseña

const crearUsuario = async () => {
  try {
    await db.authenticate();
    const User = UserModel(db);
    await db.sync();

    const password_hash = await bcrypt.hash('admin123', 10);

    const usuario = await User.create({
      name: 'Admin B',
      email: 'admin@empresab.com',
      password_hash,
      role: 'admin',
    });

    console.log('✅ Usuario creado:', usuario.toJSON());
  } catch (error) {
    console.error('❌ Error al crear usuario:', error.message);
  } finally {
    await db.close();
  }
};

crearUsuario();

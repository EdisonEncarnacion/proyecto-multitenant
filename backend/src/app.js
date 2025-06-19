// src/app.js
const express = require('express');
const cors = require('cors');
const app = express();

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth'); // ✅ Nueva ruta

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor multitenant funcionando 👍');
});

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // ✅ Habilita las rutas de login y registro

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

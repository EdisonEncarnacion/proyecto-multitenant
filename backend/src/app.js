const express = require('express');
const cors    = require('cors');
const app     = express();

// Rutas existentes
const productRoutes = require('./routes/products');
const authRoutes    = require('./routes/auth');
// 🆕 Importamos la nueva ruta de tenants
const tenantRoutes  = require('./routes/tenants');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Servidor multitenant funcionando 👍'));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
// 🆕 Montamos /api/tenants
app.use('/api/tenants', tenantRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

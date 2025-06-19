const express = require('express');
const router = express.Router();

const useTenant = require('../middleware/tenant');
const ProductModel = require('../models/Product');

router.use(useTenant);

// Ruta GET para listar productos con validación
router.get('/', async (req, res) => {
  try {
    const Product = ProductModel(req.db);
    await req.db.authenticate();           // Verifica que la conexión funcione
    await req.db.sync();                   // Asegura que el modelo y la DB estén alineados
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error en /api/products:', error);
    res.status(500).json({ error: error.message });
  }
});
router.post('/', async (req, res) => {
  try {
    const Product = ProductModel(req.db);
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: error.message });
  }
});
// 🔄 PUT: actualizar producto
router.put('/:id', async (req, res) => {
  const Product = ProductModel(req.db);
  await req.db.authenticate();
  const product = await Product.findByPk(req.params.id);

  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  await product.update(req.body);
  res.json(product); // ✅ devuelve el producto actualizado
});


// ❌ DELETE: eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const Product = ProductModel(req.db);
    const producto = await Product.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

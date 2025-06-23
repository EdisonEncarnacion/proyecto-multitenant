import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MainPage({ user, tenant }) {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '' });

  useEffect(() => {
    if (user && tenant) {
      axios.get('http://localhost:3000/api/products', { headers: { tenant } })
        .then(res => setProducts(res.data))
        .catch(console.error);
    }
  }, [user, tenant]);

  const handleNewChange = e =>
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/products', newProduct, { headers: { tenant } })
      .then(() => axios.get('http://localhost:3000/api/products', { headers: { tenant } }))
      .then(res => {
        setProducts(res.data);
        setNewProduct({ name: '', price: '', stock: '' });
      })
      .catch(console.error);
  };

  const handleEditClick = product => {
    setEditId(product.id);
    setEditForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
    });
  };

  const handleEditChange = e =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleUpdate = e => {
    e.preventDefault();
    axios.put(`http://localhost:3000/api/products/${editId}`, editForm, { headers: { tenant } })
      .then(res => {
        const updated = res.data;
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        setEditId(null);
      })
      .catch(console.error);
  };

  const handleDelete = id => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    axios.delete(`http://localhost:3000/api/products/${id}`, { headers: { tenant } })
      .then(() => axios.get('http://localhost:3000/api/products', { headers: { tenant } }))
      .then(res => setProducts(res.data))
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Productos de {tenant}</h1>

        {/* Editar producto */}
        {editId && (
          <form onSubmit={handleUpdate} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Editar Producto #{editId}</h2>
            <div className="grid gap-4">
              <input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Nombre"
                required
                className="p-2 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="price"
                type="number"
                value={editForm.price}
                onChange={handleEditChange}
                placeholder="Precio"
                required
                className="p-2 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                name="stock"
                type="number"
                value={editForm.stock}
                onChange={handleEditChange}
                placeholder="Stock"
                required
                className="p-2 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">Guardar</button>
              <button type="button" onClick={() => setEditId(null)} className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded text-white">Cancelar</button>
            </div>
          </form>
        )}

        {/* Agregar producto */}
        <form onSubmit={handleAdd} className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Agregar producto</h2>
          <div className="grid gap-4">
            <input
              name="name"
              placeholder="Nombre"
              value={newProduct.name}
              onChange={handleNewChange}
              required
              className="p-2 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              name="price"
              type="number"
              placeholder="Precio"
              value={newProduct.price}
              onChange={handleNewChange}
              required
              className="p-2 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={handleNewChange}
              required
              className="p-2 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">Agregar</button>
          </div>
        </form>

        {/* Lista de productos */}
        <div className="space-y-4">
          {products.map(p => (
            <div key={p.id} className="bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{p.name}</p>
                <p className="text-sm text-gray-400">S/. {Number(p.price).toFixed(2)} — Stock: {p.stock}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEditClick(p)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;

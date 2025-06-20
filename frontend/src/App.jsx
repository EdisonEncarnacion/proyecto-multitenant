import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Login from './Login';

function App() {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState('');
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', stock: '' });

  useEffect(() => {
    const t = localStorage.getItem('tenant');ss
    if (t) setTenant(t);
  }, []);

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
      .then(() => {
        setNewProduct({ name: '', price: '', stock: '' });
        return axios.get('http://localhost:3000/api/products', { headers: { tenant } });
      })
      .then(res => setProducts(res.data))
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
  axios
    .put(`http://localhost:3000/api/products/${editId}`, editForm, {
      headers: { tenant },
    })
    .then(res => {
      const updatedProduct = res.data; // ✅ usamos lo que viene del backend
      setProducts(prev =>
        prev.map(p =>
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );
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

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Productos de {tenant}</h1>

      {/* FORMULARIO DE EDICIÓN */}
      {editId && (
        <form onSubmit={handleUpdate} style={{ marginBottom: '20px' }}>
          <h2>Editar Producto #{editId}</h2>
          <input
            type="text" name="name" value={editForm.name}
            onChange={handleEditChange} required
          />
          <input
            type="number" name="price" value={editForm.price}
            onChange={handleEditChange} required
          />
          <input
            type="number" name="stock" value={editForm.stock}
            onChange={handleEditChange} required
          />
          <button type="submit">Guardar cambios</button>
          <button type="button" onClick={() => setEditId(null)} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </form>
      )}

      {/* FORMULARIO DE AGREGAR */}
      <form onSubmit={handleAdd} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input
          type="text" name="name" placeholder="Nombre"
          value={newProduct.name} onChange={handleNewChange} required
        />
        <input
          type="number" name="price" placeholder="Precio"
          value={newProduct.price} onChange={handleNewChange} required
        />
        <input
          type="number" name="stock" placeholder="Stock"
          value={newProduct.stock} onChange={handleNewChange} required
        />
        <button type="submit">Agregar</button>
      </form>

     {/* LISTA DE PRODUCTOS (solo vista) */}
      {products.map(p => (
        <div
          key={`${p.id}-${p.name}-${p.price}-${p.stock}`}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <strong>{p.name}</strong> — S/. {Number(p.price).toFixed(2)} (Stock: {p.stock})
          <button onClick={() => handleEditClick(p)} style={{ marginLeft: '10px' }}>
            Editar
          </button>
          <button onClick={() => handleDelete(p.id)} style={{ marginLeft: '5px' }}>
            Eliminar
          </button>
        </div>
      ))}

    </div>
  );
}

export default App;

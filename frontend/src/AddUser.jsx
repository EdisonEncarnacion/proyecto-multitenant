import React, { useState } from 'react';
import axios from 'axios';

function AddUser() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'empleado'
  });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const tenant = localStorage.getItem('tenant');

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/register',
        {
          tenant,
          ...form
        },
        { headers: { tenant } }
      );
      setMensaje(res.data.mensaje || 'Usuario agregado');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agregar usuario');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Agregar usuario</h2>

        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        {mensaje && <p className="text-green-400 mb-4 text-sm">{mensaje}</p>}

        <input
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          type="email"
          placeholder="Correo"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 mb-6 bg-gray-700 rounded border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="empleado">Empleado</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar usuario
        </button>
      </form>
    </div>
  );
}

export default AddUser;

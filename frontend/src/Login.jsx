import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '', tenant: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/auth/login', {
      email: form.email,
      password: form.password
    }, {
      headers: { tenant: form.tenant }
    })
    .then(res => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('tenant', form.tenant);
      onLogin(res.data.user);
    })
    .catch(() => alert('Login incorrecto'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        
        <input
          type="text"
          name="tenant"
          placeholder="Empresa"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
          className="w-full p-2 mb-6 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default Login;

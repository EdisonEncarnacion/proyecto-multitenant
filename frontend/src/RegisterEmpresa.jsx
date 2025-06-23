import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterEmpresa() {
  const navigate = useNavigate(); // 👈 aquí
  const [empresa, setEmpresa] = useState('');
  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const res = await axios.post('http://localhost:3000/api/tenants', {
        name: empresa,
        adminName: admin.name,
        adminEmail: admin.email,
        adminPassword: admin.password
      });

      setMensaje(res.data.mensaje || 'Empresa y admin registrados');

      // ⏳ Redirige al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrar nueva empresa</h2>

        {error && <p className="text-red-400 mb-4 text-sm">{error}</p>}
        {mensaje && <p className="text-green-400 mb-4 text-sm">{mensaje}</p>}

        <input
          type="text"
          value={empresa}
          onChange={e => setEmpresa(e.target.value)}
          placeholder="Nombre de la empresa"
          required
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={admin.name}
          onChange={e => setAdmin({ ...admin, name: e.target.value })}
          placeholder="Nombre del administrador"
          required
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          value={admin.email}
          onChange={e => setAdmin({ ...admin, email: e.target.value })}
          placeholder="Correo del administrador"
          required
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          value={admin.password}
          onChange={e => setAdmin({ ...admin, password: e.target.value })}
          placeholder="Contraseña"
          required
          className="w-full p-2 mb-6 bg-gray-700 rounded border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Registrar empresa
        </button>
      </form>
    </div>
  );
}

export default RegisterEmpresa;

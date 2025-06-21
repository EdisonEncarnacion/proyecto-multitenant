import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Register({ onRegister }) {
  const [tenants, setTenants] = useState([]);
  const [form, setForm] = useState({
    tenant: '',
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');

  // Al montar, obtenemos sólo para sugerencias (pero no forzamos uso)
  useEffect(() => {
    axios.get('http://localhost:3000/api/tenants')
      .then(res => setTenants(res.data))
      .catch(() => {/* no hacemos nada si falla */});
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!form.tenant || !form.email || !form.password) {
      return setError('Faltan campos: empresa, correo y contraseña son requeridos.');
    }

    try {
      // 1) Creamos la empresa si no existe
      await axios.post('http://localhost:3000/api/tenants', {
        name: form.tenant
      });

      // 2) Guardamos el tenant en localStorage para el middleware
      localStorage.setItem('tenant', form.tenant);

      // 3) Registramos el usuario ya apuntando al tenant
      const res = await axios.post(
  'http://localhost:3000/api/auth/register',
  {
    tenant:   form.tenant,
    name:     form.name,
    email:    form.email,
    password: form.password,
    role:     form.role
  },
  { headers: { tenant: form.tenant } }
);

// ✅ Guarda el usuario completo y llama a onRegister
localStorage.setItem('user', JSON.stringify(res.data.user));
onRegister(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Empresa
          <input
            name="tenant"
            placeholder="Nombre de empresa"
            value={form.tenant}
            onChange={handleChange}
            list="tenant-list"
            required
          />
        {/* lista de sugerencias sin obligar */}
        <datalist id="tenant-list">
        {[...new Set(tenants)]  // elimina duplicados
            .map((t, idx) => (
            <option key={idx} value={t} />
            ))
        }
        </datalist>
        </label>
        <label>
          Nombre
          <input
            name="name"
            placeholder="Nombre completo"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Correo
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Rol
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="empleado">Empleado</option>
          </select>
        </label>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;

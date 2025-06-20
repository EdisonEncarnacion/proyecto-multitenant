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
      onLogin(res.data.user); // o redirige
    })
    .catch(err => alert('Login incorrecto'));ss
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="tenant" placeholder="Empresa" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

export default Login;

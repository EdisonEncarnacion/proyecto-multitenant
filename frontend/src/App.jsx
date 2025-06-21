import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import MainPage from './MainPage'; // Extraemos la lógica de productos aquí

function App() {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState('');

  // Al arrancar, leemos del localStorage
 useEffect(() => {
  const t = localStorage.getItem('tenant');
  setTenant(t || '');

  const u = localStorage.getItem('user');
  if (u) {
    try {
      setUser(JSON.parse(u));
    } catch {
      console.warn('Usuario en localStorage corrupto, limpiando');
      localStorage.removeItem('user');
    }
  }
}, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setTenant('');
  };

  return (
    <Router>
      <nav style={{ padding: 10 }}>
        {!user && (
          <>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && <button onClick={handleLogout}>Cerrar sesión</button>}
      </nav>

      <Routes>
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" replace />
              : <Login onLogin={(loggedUser) => {
                  setUser(loggedUser);
                  const t = localStorage.getItem('tenant');
                  if (t) setTenant(t);
                  localStorage.setItem('user', JSON.stringify(loggedUser));
                }} />
          }
        />

        <Route
          path="/register"
          element={
            user
              ? <Navigate to="/" replace />
              : <Register onRegister={(loggedUser) => {
                  setUser(loggedUser);
                  const t = localStorage.getItem('tenant');
                  if (t) setTenant(t);
                  localStorage.setItem('user', JSON.stringify(loggedUser));
                }} />
          }
        />

        <Route
          path="/"
          element={
            user
              ? <MainPage user={user} tenant={tenant} />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';

import Login from './Login';
import RegisterEmpresa from './RegisterEmpresa';
import MainPage from './MainPage';
import AddUser from './AddUser';

function App() {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState('');
  const location = useLocation();

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
    <>
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center shadow-md">
        <div className="ml-auto space-x-4">
          {!user && (
            <>
              {location.pathname !== '/login' && (
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Iniciar sesión
                </Link>
              )}
              {location.pathname !== '/register' && (
                <Link
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Registrarse
                </Link>
              )}
            </>
          )}

          {user && (
            <>
              {location.pathname !== '/add-user' && (
                <Link
                  to="/add-user"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
                >
                  Agregar Usuario
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
              >
                Cerrar sesión
              </button>
            </>
          )}

        </div>
      </nav>

      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login
                onLogin={(loggedUser) => {
                  setUser(loggedUser);
                  const t = localStorage.getItem('tenant');
                  if (t) setTenant(t);
                  localStorage.setItem('user', JSON.stringify(loggedUser));
                }}
              />
            )
          }
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <RegisterEmpresa />}
        />

        <Route
          path="/add-user"
          element={user ? <AddUser /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/"
          element={
            user ? (
              <MainPage user={user} tenant={tenant} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;

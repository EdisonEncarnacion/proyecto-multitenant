import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // 👈 Importa BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>     {/* 👈 Envuelve App con BrowserRouter */}
    <App />
  </BrowserRouter>
);

// Opcional: medir rendimiento
reportWebVitals();

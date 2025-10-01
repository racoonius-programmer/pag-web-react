// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 1. IMPORTAR ESTILOS CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'; 

// 2. IMPORTAR JAVASCRIPT DE BOOTSTRAP (NECESARIO PARA CARRUSEL, MODAL Y DROPDOWNS)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa el bundle completo de JS

// NOTA: No necesitamos importar Footer aquí, se usa dentro de App.tsx

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 💡 Importamos la función de inicialización de la DB
import { initUserDB } from './utils/initUsers'; 
// 💡 CORRECCIÓN DE RUTA: './hooks/useCart' (minúsculas y sin extensión)
import { CartProvider } from './hooks/UseCart';

// Import de css
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css'; 

// Las librerias de bootstrap
// @ts-ignore
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
(window as any).bootstrap = bootstrap;

// --------------------------------------------------------
// 1. INICIALIZACIÓN DE LA BASE DE DATOS LOCAL
// --------------------------------------------------------
initUserDB(); 

// --------------------------------------------------------
// 2. RENDERIZADO DE LA APLICACIÓN
// --------------------------------------------------------
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 🚀 ENVOLVEMOS LA APLICACIÓN CON EL CARTPROVIDER */}
    <CartProvider> 
        <App />
    </CartProvider>
  </React.StrictMode>,
);
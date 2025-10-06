// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// 💡 Importamos la función de inicialización de la DB
import { initUserDB } from './utils/initUsers'; 

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
// Llama a la función para cargar los usuarios del JSON a localStorage 
// si no existen aún. Esto se ejecuta una sola vez al cargar la página.
initUserDB(); 

// --------------------------------------------------------
// 2. RENDERIZADO DE LA APLICACIÓN
// --------------------------------------------------------
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
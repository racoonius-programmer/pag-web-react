// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Importamos la función de inicialización de la DB
import { initUserDB } from './utils/initUsers'; 

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
    {/*ENVOLVEMOS LA APLICACIÓN CON EL CARTPROVIDER */}
    <CartProvider> 
        <App />
    </CartProvider>
  </React.StrictMode>,
);

/*
  src/main.tsx - Punto de entrada de la aplicación

  Qué hace:
  - Inicializa datos de la "base de datos" local llamando a `initUserDB()`.
    Esa función prepara `localStorage` con usuarios de ejemplo necesarios
    para la aplicación (login, roles, avatar, flags como `descuentoDuoc`).
  - Importa estilos y scripts necesarios (Bootstrap CSS/JS, iconos, index.css).
  - Envuelve la aplicación (`App`) con `CartProvider` para proporcionar
    contexto y funciones del carrito a toda la app.
  - Monta el árbol React en el elemento DOM con id `root` usando
    `ReactDOM.createRoot(...).render(...)`.

  Detalles importantes:
  - `initUserDB()` debe ejecutarse antes de renderizar para garantizar que
    exista la estructura mínima en `localStorage` que usan los hooks/páginas.

  - `CartProvider` es un Provider React (context) que expone funciones como
    `addToCart` y el estado actual del carrito; envolver `App` aquí hace que
    cualquier componente dentro de la app pueda consumirlo con `useContext`.



  Archivos relevantes referenciados desde aquí:
  - src/App.tsx
    Razón: componente raíz que define rutas (React Router) y layout.

  - src/utils/initUsers.ts
    Razón: función que inicializa la DB simulada en localStorage.

  - src/hooks/UseCart.tsx
    Razón: proveedor `CartProvider` que envuelve la app.
    
  - src/index.css
    Razón: estilos globales de la aplicación.
*/
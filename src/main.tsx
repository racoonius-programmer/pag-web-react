// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Importamos las funciones de migración
import { ejecutarMigracionAutomatica } from './utils/migracionUsuarios';

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
// 1. INICIALIZACIÓN DE DATOS DE USUARIOS EN LA API
// --------------------------------------------------------
// Ejecutar migración automática si es necesaria
ejecutarMigracionAutomatica().catch(error => {
    console.error('Error en la inicialización de datos:', error);
});

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
  - Ejecuta migración automática de usuarios a la API si es necesaria.
    Esto asegura que los datos de usuarios estén disponibles en la API
    cuando la aplicación inicie.
  - Importa estilos y scripts necesarios (Bootstrap CSS/JS, iconos, index.css).
  - Envuelve la aplicación (`App`) con `CartProvider` para proporcionar
    contexto y funciones del carrito a toda la app.
  - Monta el árbol React en el elemento DOM con id `root` usando
    `ReactDOM.createRoot(...).render(...)`.

  Detalles importantes:
  - La migración automática se ejecuta de forma asíncrona para no bloquear
    el renderizado de la aplicación.

  - `CartProvider` es un Provider React (context) que expone funciones como
    `addToCart` y el estado actual del carrito; envolver `App` aquí hace que
    cualquier componente dentro de la app pueda consumirlo con `useContext`.

  Archivos relevantes referenciados desde aquí:
  - src/App.tsx
    Razón: componente raíz que define rutas (React Router) y layout.

  - src/utils/migracionUsuarios.ts
    Razón: funciones para migrar usuarios del JSON local a la API.

  - src/hooks/UseCart.tsx
    Razón: proveedor `CartProvider` que envuelve la app.
    
  - src/index.css
    Razón: estilos globales de la aplicación.
*/
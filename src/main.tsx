// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
// Asegúrate de que la extensión sea correcta: App.tsx
import App from './App.tsx'; 

// 1. Importa los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// 2. Importa tus estilos globales
import './index.css'; 
// 3. Importa los estilos de los íconos (si los instalaste)
import 'bootstrap-icons/font/bootstrap-icons.css';
// 🚨 ELIMINAR: Ya no necesitas importar Footer aquí.
// import Footer from './components/Footer.tsx'; 


ReactDOM.createRoot(document.getElementById('root')!).render( // Agregamos '!' para asegurar que el elemento existe
  <React.StrictMode>
    {/* 💥 CAMBIO CRÍTICO: Debes renderizar el componente App */}
    <App /> 
  </React.StrictMode>,
)
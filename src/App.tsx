// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa los componentes de Layout
import Header from './components/Header';
import Footer from './components/Footer'; 

// Importa los componentes de Página
import MainScreen from './pages/Inicio'; 
// Importa placeholders para evitar errores, aunque aún no estén terminados
//import PagoScreen from './pages/PagoScreen'; 
//import LoginScreen from './pages/LoginScreen'; 
//import ProductosScreen from './pages/ProductosScreen'; 
//import CarritoScreen from './pages/CarritoScreen'; 


const App: React.FC = () => {
  return (
    // 1. BrowserRouter: Habilita el enrutamiento basado en URL
    <BrowserRouter>
      {/* Estructura principal para que el Footer quede abajo */}
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'black' }}>
        
        {/* HEADER: Componente fijo visible en todas las rutas */}
        <Header />
        
        {/* MAIN: El contenido que cambia según la ruta */}
        <main className="flex-grow-1">
          <Routes>
            
            {/* RUTA PRINCIPAL (INICIO) */}
            <Route path="/" element={<MainScreen />} />            
            <Route path="/main" element={<MainScreen />} />
            
            {/* RUTAS PLACEHOLDER 
            <Route path="/productos" element={<ProductosScreen />} />
            <Route path="/inicio-sesion" element={<LoginScreen />} />
            <Route path="/carrito" element={<CarritoScreen />} />
            <Route path="/pago" element={<PagoScreen />} />
            <Route path="/registro" element={<LoginScreen />} /> {/* Asumo que el registro usa o redirige al login temporalmente */}
            
            {/* RUTA 404 */}
            <Route path="*" element={
              <div className="text-center p-5 text-white bg-dark">
                <h1>404</h1>
                <p>Página no encontrada.</p>
              </div>
            } />
          </Routes>
        </main>

        {/* FOOTER: Componente fijo en la parte inferior */}
        <Footer />
           
      </div>
    </BrowserRouter>
  );
};

export default App;
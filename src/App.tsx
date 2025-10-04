import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importa los componentes de Layout
import Header from './components/Header';
import Footer from './components/Footer'; 

// Importa los componentes de Página (Asegúrate de que existan o usa placeholders)
import MainScreen from './pages/Inicio'; 
import LoginScreen from './pages/User_Login'; 
import RegisterScreen from './pages/User_Register'; // Ruta de Registro separada
import SobreLevelUp from './pages/SobreLevelUp';
import ProductoCarrito from './pages/ProductsCarrito';
import ProductShop from './pages/ProductShop';
import Events from './pages/Events';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'black' }}>
        
        <Header />
        
        <main className="flex-grow-1">
          <Routes>
            
            {/* 1. RUTAS PRINCIPALES */}
            <Route path="/" element={<MainScreen />} />            
            <Route path="/main" element={<MainScreen />} />

            {/* 2. RUTAS DE NAVEGACIÓN PRINCIPAL */}
            <Route path="/sobreLEVEL-UP" element={<SobreLevelUp />} />
            <Route path="/productos" element={<ProductShop/>} /> 
            <Route path="/eventos" element={ <Events/> } />

            
            {/* 3. RUTAS DE AUTENTICACIÓN (Nombres limpios y consistentes) */}
            <Route path="/login" element={<LoginScreen />} />         {/* Iniciar Sesión */}
            <Route path="/register" element={<RegisterScreen />} />   {/* Registro */}

            {/* 4. RUTAS DE COMPRA */}
            <Route path="/carrito" element={<ProductoCarrito />} />


            {/* TODO: Otras rutas pendientes: /perfil, /admin, /producto-detalle/:codigo */}
            
            {/* RUTA 404 (Debe ser la última) */}
            <Route path="*" element={
              <div className="text-center p-5 text-white bg-dark">
                <h1>404</h1>
                <p>Página no encontrada.</p>
                <Link to="/main" className='btn btn-primary'>Ir al Inicio</Link>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
          
      </div>
    </BrowserRouter>
  );
};

export default App;
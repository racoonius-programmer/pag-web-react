import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Páginas
import MainScreen from "./pages/Inicio";
import LoginScreen from "./pages/User_Login";
import UserRegisterPage from "./pages/User_Register";
import SobreLevelUp from "./pages/SobreLevelUp";
import ProductoCarrito from "./pages/ProductsCarrito";
import ProductShop from "./pages/ProductShop";
import Events from "./pages/Events";
import ProductDetail from "./pages/ProductDetail";
import Payment from "./pages/Payment";
import UserPerfil from "./pages/UserPerfil";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App: React.FC = () => {
  return (
    <Router>
      <div
        className="d-flex flex-column min-vh-100"
        style={{ backgroundColor: "black" }}
      >
        {/* ✅ Header y Footer no deben depender de datos de usuario aún */}
        <Header />

        <main className="flex-grow-1">
          <Routes>
            {/* 🔹 Rutas principales */}
            <Route path="/" element={<MainScreen />} />
            <Route path="/main" element={<MainScreen />} />

            {/* 🔹 Secciones informativas */}
            <Route path="/sobreLEVEL-UP" element={<SobreLevelUp />} />
            <Route path="/productos" element={<ProductShop />} />
            <Route path="/productos/:codigo" element={<ProductDetail />} />
            <Route path="/eventos" element={<Events />} />

            {/* 🔹 Autenticación */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<UserRegisterPage />} />


            {/* 🔹 Carrito, Pago y Perfil */}
            <Route path="/carrito" element={<ProductoCarrito />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/perfil" element={<UserPerfil />} />

            {/* 🔹 RUTA 404 */}
            <Route
              path="*"
              element={
                <div className="text-center p-5 text-white bg-dark">
                  <h1>404</h1>
                  <p>Página no encontrada.</p>
                  <Link to="/main" className="btn btn-primary">
                    Ir al Inicio
                  </Link>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;

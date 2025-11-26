import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Layout
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Hook para manejar logout entre pestañas
import { useLogoutHandler } from "./hooks/useSessionStorage";

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
import Contact from "./pages/Contact";

import Admin_Layout from './pages/admin/Admin_Layout';
import Admin_Dashboard from './pages/admin/Admin_Dashboard';
import Admin_Users from './pages/admin/Admin_Users';
import Admin_Products from './pages/admin/Admin_Products';
import Admin_Reload from "./pages/Admin_Reload";
import OrdersPage from './pages/Orders';
import Admin_Orders from './pages/admin/Admin_Orders';

const App: React.FC = () => {
  // Activar el manejo de logout entre pestañas
  useLogoutHandler();

  return (
    <Router>
      <div
        className="d-flex flex-column min-vh-100"
        style={{ backgroundColor: "black" }}
      >
        {/*Header y Footer no deben depender de datos de usuario*/}
        <Header />

        <main className="flex-grow-1">
          <Routes>
            {/* 🔹 Rutas principales */}
            <Route path="/" element={<MainScreen />} />
            <Route path="/main" element={<MainScreen />} />

            {/* Admin - Protegidas con ProtectedRoute */}
            <Route path="/admin_main" element={
              <ProtectedRoute requireAdmin>
                <Admin_Reload/>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <Admin_Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Admin_Dashboard />} />
              <Route path="users" element={<Admin_Users />} />
              <Route path="products" element={<Admin_Products />} />
              <Route path="orders" element={<Admin_Orders />} />
            </Route>

            {/* 🔹 Secciones informativas */}
            <Route path="/sobreLEVEL-UP" element={<SobreLevelUp />} />
            <Route path="/productos" element={<ProductShop />} />
            <Route path="/productos/:codigo" element={<ProductDetail />} />
            <Route path="/eventos" element={<Events />} />
            <Route path="/contacto" element={<Contact/>} />

            {/* 🔹 Autenticación */}
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<UserRegisterPage />} />

            


            {/* 🔹 Carrito, Pago y Perfil */}
            <Route path="/carrito" element={<ProductoCarrito />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/perfil" element={<UserPerfil />} />
            <Route path="/pedidos" element={<OrdersPage />} />

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

/*
  Descripción y funcionamiento:

  - Propósito: `App.tsx` es el componente raíz que configura el enrutamiento
    (React Router) de la aplicación, envuelve la UI con el layout básico
    (Header y Footer) y registra todas las rutas principales y secundarias.

  - Comportamiento principal:
    1. Importa y muestra `Header` en la parte superior y `Footer` en la parte
       inferior. Estas capas son persistentes entre rutas.

    2. Dentro del `<main>` declara un conjunto de `<Route>` usando `<Routes>`.
       Cada ruta mapea una URL a un componente de página (p. ej. `/login` -> `User_Login`).

    3. Define rutas anidadas para la sección de administración (`/admin`) usando
       `Admin_Layout` como layout padre y rutas hijas para `Admin_Dashboard`,
       `Admin_Users` y `Admin_Products`.

    4. Tiene una ruta comodín (`path="*"`) que muestra una página 404 simple
       con un enlace al inicio cuando la URL no coincide con ninguna ruta.

    5. Importa los estilos y scripts de Bootstrap para tener los componentes
       y utilidades de UI disponibles (CSS y bundle JS).

  - Puntos importantes a entender:
    - `App` no maneja estado global de negocio (usuarios, carrito, etc.). Ese
      estado se provee desde otros hooks/Providers (por ejemplo `CartProvider`
      en `main.tsx`). Aquí solo se define la navegación y layout.
    - Las páginas importadas (Inicio, Productos, Pago, etc.) contienen la
      lógica específica de cada sección; `App` las referencia para enlazarlas
      a URLs concretas.

  Nota: `App.tsx` actúa como mapa de rutas de la aplicación.
*/

// src/pages/admin/Admin_Layout.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

/*
  Admin_Layout
  -------------
  Layout general para la sección de administración.

  - Proporciona un sidebar (colapsable) con navegación interna para las rutas
    del admin (Dashboard, User Manager, Product Manager, etc.).
  - Usa `Outlet` para renderizar la ruta hija seleccionada dentro del layout.
  - No contiene datos complejos; solo maneja estado UI (sidebar collapsed)
    y la navegación usando `useNavigate`.
*/
const Admin_Layout: React.FC = () => {
    // Estado: si la barra lateral está colapsada o expandida
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Hooks de react-router para navegación y para conocer la ruta actual
    const navigate = useNavigate();
    const location = useLocation();

    // Alterna el estado del sidebar
    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

    // Comprueba si la ruta actual coincide exactamente con `path`.
    // Usado para marcar la opción activa en el sidebar.
    const isActive = (path: string) => location.pathname === path;

    // Navega a la ruta indicada
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh' }} className="d-flex">
            {/* Sidebar: contiene botones que navegan dentro del área admin */}
            <div className={`bg-dark text-white ${sidebarCollapsed ? 'collapsed-sidebar' : 'sidebar'}`}>
                <div className="sidebar-header p-3 border-bottom border-secondary">
                    <div className="d-flex align-items-center justify-content-between">
                        {/* Si no está colapsado, mostrar el título */}
                        {!sidebarCollapsed && <h5 className="mb-0">Admin Panel</h5>}

                        {/* Botón de colapsar/expandir */}
                        <button 
                            className="btn btn-outline-light btn-sm"
                            onClick={toggleSidebar}
                        >
                            <i className={`bi ${sidebarCollapsed ? 'bi-list' : 'bi-x'}`}></i>
                        </button>
                    </div>
                </div>

                <nav className="sidebar-nav mt-3">
                    <ul className="nav flex-column">
                        {/* Cada botón usa `handleNavigation` y `isActive` para controlar estilos */}

                        {/* Dashboard */}
                        <li className="nav-item">
                            <button
                                className={`nav-link text-start w-100 border-0 ${
                                    isActive('/admin') ? 'bg-primary' : 'bg-transparent'
                                } text-white`}
                                onClick={() => handleNavigation('/admin')}
                            >
                                <i className="bi bi-speedometer2 me-2"></i>
                                {!sidebarCollapsed && 'Dashboard'}
                            </button>
                        </li>

                        {/* User Manager */}
                        <li className="nav-item">
                            <button
                                className={`nav-link text-start w-100 border-0 ${
                                    isActive('/admin/users') ? 'bg-primary' : 'bg-transparent'
                                } text-white`}
                                onClick={() => handleNavigation('/admin/users')}
                            >
                                <i className="bi bi-people me-2"></i>
                                {!sidebarCollapsed && 'User Manager'}
                            </button>
                        </li>

                        {/* Product Manager */}
                        <li className="nav-item">
                            <button
                                className={`nav-link text-start w-100 border-0 ${
                                    isActive('/admin/products') ? 'bg-primary' : 'bg-transparent'
                                } text-white`}
                                onClick={() => handleNavigation('/admin/products')}
                            >
                                <i className="bi bi-box me-2"></i>
                                {!sidebarCollapsed && 'Product Manager'}
                            </button>
                        </li>

                        {/* Divider visual */}
                        <li className="nav-item">
                            <hr className="text-secondary mx-3" />
                        </li>

                        {/* Volver al sitio (ruta pública) */}
                        <li className="nav-item">
                            <button
                                className="nav-link text-start w-100 border-0 bg-transparent text-white-50"
                                onClick={() => navigate('/')}
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                {!sidebarCollapsed && 'Volver al sitio'}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content: las rutas hijas se renderizan aquí */}
            <div className="flex-grow-1">
                <Outlet />
            </div>

            {/* Estilos CSS locales al componente: definen ancho y comportamiento del sidebar */}
            <style>{`
                .sidebar {
                    width: 280px;
                    transition: width 0.3s ease;
                    min-height: 100vh;
                }
                .collapsed-sidebar {
                    width: 70px;
                    transition: width 0.3s ease;
                    min-height: 100vh;
                }
                .sidebar-nav .nav-link {
                    padding: 12px 20px;
                    border-radius: 0;
                    margin: 2px 8px;
                    transition: background-color 0.2s ease;
                }
                .sidebar-nav .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                .sidebar-header {
                    position: sticky;
                    top: 0;
                    background-color: inherit;
                    z-index: 10;
                }
            `}</style>
        </div>
    );
};

export default Admin_Layout;

/*
  Dónde se importa / usa este Layout:
  - src/App.tsx
    * Se importa `Admin_Layout` y se emplea como layout para las rutas del area
      de administración (por ejemplo: `<Route path="/admin" element={<Admin_Layout/>}> ...`).

  Por qué:
  - Centraliza la navegación y el contenedor visual del panel admin. Las rutas hijas
    se renderizan en el `<Outlet />` permitiendo que todas compartan el mismo sidebar
    y estilos sin duplicar código.
*/
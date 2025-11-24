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
            <div className={`admin-sidebar ${sidebarCollapsed ? 'admin-sidebar-collapsed' : 'admin-sidebar-expanded'}`}>
                <div className="sidebar-header p-3 border-bottom border-secondary">
                    <div className="d-flex align-items-center justify-content-between">
                        {/* Si no está colapsado, mostrar el título */}
                        {!sidebarCollapsed && <h5 className="mb-0 text-white">Admin Panel</h5>}

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

                        {/* Orders Manager */}
                        <li className="nav-item">
                            <button
                                className={`nav-link text-start w-100 border-0 ${
                                    isActive('/admin/orders') ? 'bg-primary' : 'bg-transparent'
                                } text-white`}
                                onClick={() => handleNavigation('/admin/orders')}
                            >
                                <i className="bi bi-receipt me-2"></i>
                                {!sidebarCollapsed && 'Orders Manager'}
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
                                {!sidebarCollapsed && 'Volver al inicio'}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content: las rutas hijas se renderizan aquí */}
            <div className={`admin-main-content ${sidebarCollapsed ? 'admin-content-collapsed' : 'admin-content-expanded'}`}>
                <Outlet />
            </div>

            {/* Estilos CSS locales al componente: sidebar completamente fijo */}
            <style>{`
                /* Contenedor principal del admin layout */
                .admin-layout-container {
                    display: flex;
                    min-height: 100vh;
                    background-color: #121212;
                }
                
                .admin-sidebar-expanded {
                    width: 280px;
                    position: fixed;
                    top: 80px;
                    left: 0;
                    height: calc(100vh - 80px);
                    background-color: #343a40;
                    z-index: 1000;
                    overflow-y: auto;
                    transition: all 0.3s ease;
                    border-right: 1px solid #495057;
                }
                
                .admin-sidebar-collapsed {
                    width: 70px;
                    position: fixed;
                    top: 80px;
                    left: 0;
                    height: calc(100vh - 80px);
                    background-color: #343a40;
                    z-index: 1000;
                    overflow-y: auto;
                    transition: all 0.3s ease;
                    border-right: 1px solid #495057;
                }
                
                .admin-content-expanded {
                    margin-left: 280px;
                    width: calc(100% - 280px);
                    background-color: #121212;
                    transition: all 0.3s ease;
                    padding: 80px 1rem 1rem 1rem;
                    min-height: 100vh;
                    box-sizing: border-box;
                }
                
                .admin-content-collapsed {
                    margin-left: 70px;
                    width: calc(100% - 70px);
                    background-color: #121212;
                    transition: all 0.3s ease;
                    padding: 80px 1rem 1rem 1rem;
                    min-height: 100vh;
                    box-sizing: border-box;
                }
                
                .sidebar-nav .nav-link {
                    padding: 12px 20px;
                    border-radius: 0;
                    margin: 2px 8px;
                    transition: background-color 0.2s ease;
                    white-space: nowrap;
                }
                
                .sidebar-nav .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                
                .sidebar-header {
                    position: sticky;
                    top: 0;
                    background-color: #343a40;
                    z-index: 10;
                }
                
                /* Scrollbar personalizado para el sidebar */
                .admin-sidebar-expanded::-webkit-scrollbar,
                .admin-sidebar-collapsed::-webkit-scrollbar {
                    width: 6px;
                }
                
                .admin-sidebar-expanded::-webkit-scrollbar-track,
                .admin-sidebar-collapsed::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.1);
                }
                
                .admin-sidebar-expanded::-webkit-scrollbar-thumb,
                .admin-sidebar-collapsed::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                }
                
                .admin-sidebar-expanded::-webkit-scrollbar-thumb:hover,
                .admin-sidebar-collapsed::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }

                /* Responsive: en pantallas muy pequeñas */
                @media (max-width: 768px) {
                    .admin-sidebar-expanded {
                        width: 100%;
                        transform: translateX(-100%);
                    }
                    
                    .admin-sidebar-expanded.mobile-open {
                        transform: translateX(0);
                    }
                    
                    .admin-content-expanded,
                    .admin-content-collapsed {
                        margin-left: 0;
                        width: 100%;
                        padding: 80px 1rem 1rem 1rem;
                    }
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
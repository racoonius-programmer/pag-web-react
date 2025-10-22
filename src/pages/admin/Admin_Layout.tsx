// src/pages/admin/Admin_Layout.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Admin_Layout: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

    const isActive = (path: string) => location.pathname === path;

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh' }} className="d-flex">
            {/* Sidebar */}
            <div className={`bg-dark text-white ${sidebarCollapsed ? 'collapsed-sidebar' : 'sidebar'}`}>
                <div className="sidebar-header p-3 border-bottom border-secondary">
                    <div className="d-flex align-items-center justify-content-between">
                        {!sidebarCollapsed && <h5 className="mb-0">Admin Panel</h5>}
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

                        {/* Divider */}
                        <li className="nav-item">
                            <hr className="text-secondary mx-3" />
                        </li>

                        {/* Volver al sitio */}
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

            {/* Main Content */}
            <div className="flex-grow-1">
                <Outlet />
            </div>

            {/* Estilos CSS */}
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
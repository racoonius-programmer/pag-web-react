// src/pages/Admin_Inicio.tsx
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../types/User';
import type { Product } from '../types/Product';
import productosDB from '../data/productos.json';

const Admin_Inicio: React.FC = () => {
    // Estados para el sidebar y los menús activos
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState<'dashboard' | 'users' | 'products'>('dashboard');
    const [userMenuExpanded, setUserMenuExpanded] = useState(false);
    const [productMenuExpanded, setProductMenuExpanded] = useState(false);

    // Estados para datos
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [productos, setProductos] = useState<Product[]>([]);
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Cargar datos al montar el componente
    useEffect(() => {
        // Cargar usuarios desde localStorage
        const usuariosJSON = localStorage.getItem("usuarios");
        const usuariosList: Usuario[] = usuariosJSON ? JSON.parse(usuariosJSON) : [];
        setUsuarios(usuariosList);

        // Cargar productos desde la base de datos
        setProductos(productosDB as Product[]);
    }, []);

    // Funciones para manejar el menú
    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
    
    const handleMenuClick = (menu: 'dashboard' | 'users' | 'products') => {
        setActiveMenu(menu);
        if (menu === 'users') {
            setUserMenuExpanded(!userMenuExpanded);
            setProductMenuExpanded(false);
        } else if (menu === 'products') {
            setProductMenuExpanded(!productMenuExpanded);
            setUserMenuExpanded(false);
        } else {
            setUserMenuExpanded(false);
            setProductMenuExpanded(false);
        }
    };

    // Funciones para estadísticas del dashboard
    const getTotalUsers = () => usuarios.length;
    const getTotalProducts = () => productos.length;
    const getDuocUsers = () => usuarios.filter(u => u.descuentoDuoc).length;
    const getAdminUsers = () => usuarios.filter(u => u.rol === 'admin').length;
    const getProductsByCategory = () => {
        const categories: { [key: string]: number } = {};
        productos.forEach(p => {
            if (p.categoria) {
                categories[p.categoria] = (categories[p.categoria] || 0) + 1;
            }
        });
        return categories;
    };

    // Función para eliminar usuario
    const deleteUser = (userId: number) => {
        const updatedUsers = usuarios.filter(u => u.id !== userId);
        setUsuarios(updatedUsers);
        localStorage.setItem("usuarios", JSON.stringify(updatedUsers));
        setSelectedUser(null);
    };

    // Función para formatear categorías
    const formatCategoria = (categoria: string): string => {
        return categoria.replace(/_/g, ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Renderizado del Dashboard
    const renderDashboard = () => {
        const categoriesData = getProductsByCategory();
        
        return (
            <div className="row g-4">
                <div className="col-12">
                    <h1 className="text-white mb-4">Dashboard de Administración</h1>
                </div>
                
                {/* Tarjetas de estadísticas */}
                <div className="col-lg-3 col-md-6">
                    <div className="card bg-primary text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title">Total Usuarios</h6>
                                    <h2 className="mb-0">{getTotalUsers()}</h2>
                                </div>
                                <div className="align-self-center">
                                    <i className="bi bi-people fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card bg-success text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title">Total Productos</h6>
                                    <h2 className="mb-0">{getTotalProducts()}</h2>
                                </div>
                                <div className="align-self-center">
                                    <i className="bi bi-box fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card bg-info text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title">Usuarios DUOC</h6>
                                    <h2 className="mb-0">{getDuocUsers()}</h2>
                                </div>
                                <div className="align-self-center">
                                    <i className="bi bi-mortarboard fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6">
                    <div className="card bg-warning text-white">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="card-title">Administradores</h6>
                                    <h2 className="mb-0">{getAdminUsers()}</h2>
                                </div>
                                <div className="align-self-center">
                                    <i className="bi bi-shield-check fs-1"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráfico de categorías de productos */}
                <div className="col-lg-8">
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            <h5 className="mb-0">Productos por Categoría</h5>
                        </div>
                        <div className="card-body">
                            {Object.entries(categoriesData).map(([category, count]) => (
                                <div key={category} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span>{formatCategoria(category)}</span>
                                        <span>{count}</span>
                                    </div>
                                    <div className="progress">
                                        <div 
                                            className="progress-bar" 
                                            style={{ width: `${(count / getTotalProducts()) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actividad reciente */}
                <div className="col-lg-4">
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            <h5 className="mb-0">Actividad Reciente</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="flex-shrink-0">
                                    <i className="bi bi-person-plus-fill text-success"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <small>Nuevo usuario registrado</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <div className="flex-shrink-0">
                                    <i className="bi bi-box-seam text-info"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <small>Productos actualizados</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <i className="bi bi-cart-check text-warning"></i>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <small>Nuevas órdenes procesadas</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Renderizado del User Manager
    const renderUserManager = () => (
        <div className="row g-4">
            <div className="col-12">
                <h1 className="text-white mb-4">Gestión de Usuarios</h1>
            </div>
            
            <div className="col-lg-8">
                <div className="card bg-dark text-white">
                    <div className="card-header">
                        <h5 className="mb-0">Lista de Usuarios</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>DUOC</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map(usuario => (
                                        <tr key={usuario.id}>
                                            <td>{usuario.id}</td>
                                            <td>{usuario.username}</td>
                                            <td>{usuario.correo}</td>
                                            <td>
                                                <span className={`badge ${usuario.rol === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                                    {usuario.rol}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${usuario.descuentoDuoc ? 'bg-success' : 'bg-secondary'}`}>
                                                    {usuario.descuentoDuoc ? 'Sí' : 'No'}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-info me-2"
                                                    onClick={() => setSelectedUser(usuario)}
                                                >
                                                    Ver
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteUser(usuario.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalles del usuario seleccionado */}
            <div className="col-lg-4">
                <div className="card bg-dark text-white">
                    <div className="card-header">
                        <h5 className="mb-0">Detalles del Usuario</h5>
                    </div>
                    <div className="card-body">
                        {selectedUser ? (
                            <div>
                                <p><strong>ID:</strong> {selectedUser.id}</p>
                                <p><strong>Username:</strong> {selectedUser.username}</p>
                                <p><strong>Email:</strong> {selectedUser.correo}</p>
                                <p><strong>Teléfono:</strong> {selectedUser.telefono}</p>
                                <p><strong>Dirección:</strong> {selectedUser.direccion}</p>
                                <p><strong>Región:</strong> {selectedUser.region}</p>
                                <p><strong>Comuna:</strong> {selectedUser.comuna}</p>
                                <p><strong>Fecha Nacimiento:</strong> {selectedUser.fechaNacimiento}</p>
                                <p><strong>Rol:</strong> 
                                    <span className={`badge ms-2 ${selectedUser.rol === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                        {selectedUser.rol}
                                    </span>
                                </p>
                                <p><strong>Descuento DUOC:</strong> 
                                    <span className={`badge ms-2 ${selectedUser.descuentoDuoc ? 'bg-success' : 'bg-secondary'}`}>
                                        {selectedUser.descuentoDuoc ? 'Activado' : 'Desactivado'}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <p className="text-muted">Selecciona un usuario para ver sus detalles</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Renderizado del Product Manager
    const renderProductManager = () => (
        <div className="row g-4">
            <div className="col-12">
                <h1 className="text-white mb-4">Gestión de Productos</h1>
            </div>
            
            <div className="col-lg-8">
                <div className="card bg-dark text-white">
                    <div className="card-header">
                        <h5 className="mb-0">Lista de Productos</h5>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Precio</th>
                                        <th>Categoría</th>
                                        <th>Fabricante</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map(producto => (
                                        <tr key={producto.codigo}>
                                            <td>{producto.codigo}</td>
                                            <td>{producto.nombre}</td>
                                            <td>${producto.precio?.toLocaleString('es-ES')}</td>
                                            <td>
                                                <span className="badge bg-info">
                                                    {producto.categoria ? formatCategoria(producto.categoria) : 'Sin categoría'}
                                                </span>
                                            </td>
                                            <td>{producto.fabricante || 'N/A'}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-sm btn-outline-info me-2"
                                                    onClick={() => setSelectedProduct(producto)}
                                                >
                                                    Ver
                                                </button>
                                                <button className="btn btn-sm btn-outline-warning me-2">
                                                    Editar
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger">
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalles del producto seleccionado */}
            <div className="col-lg-4">
                <div className="card bg-dark text-white">
                    <div className="card-header">
                        <h5 className="mb-0">Detalles del Producto</h5>
                    </div>
                    <div className="card-body">
                        {selectedProduct ? (
                            <div>
                                {selectedProduct.imagen && (
                                    <img 
                                        src={selectedProduct.imagen} 
                                        alt={selectedProduct.nombre}
                                        className="img-fluid mb-3 rounded"
                                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <p><strong>Código:</strong> {selectedProduct.codigo}</p>
                                <p><strong>Nombre:</strong> {selectedProduct.nombre}</p>
                                <p><strong>Precio:</strong> ${selectedProduct.precio?.toLocaleString('es-ES')}</p>
                                <p><strong>Categoría:</strong> {selectedProduct.categoria ? formatCategoria(selectedProduct.categoria) : 'Sin categoría'}</p>
                                <p><strong>Fabricante:</strong> {selectedProduct.fabricante || 'N/A'}</p>
                                <p><strong>Distribuidor:</strong> {selectedProduct.distribuidor || 'N/A'}</p>
                                <p><strong>Marca:</strong> {selectedProduct.Marca || 'N/A'}</p>
                                <p><strong>Material:</strong> {selectedProduct.Material || 'N/A'}</p>
                                {selectedProduct.Descripcion && (
                                    <p><strong>Descripción:</strong> {selectedProduct.Descripcion}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-muted">Selecciona un producto para ver sus detalles</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

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
                                className={`nav-link text-start w-100 border-0 ${activeMenu === 'dashboard' ? 'bg-primary' : 'bg-transparent'} text-white`}
                                onClick={() => handleMenuClick('dashboard')}
                            >
                                <i className="bi bi-speedometer2 me-2"></i>
                                {!sidebarCollapsed && 'Dashboard'}
                            </button>
                        </li>

                        {/* User Manager */}
                        <li className="nav-item">
                            <button
                                className={`nav-link text-start w-100 border-0 ${activeMenu === 'users' ? 'bg-primary' : 'bg-transparent'} text-white`}
                                onClick={() => handleMenuClick('users')}
                            >
                                <i className="bi bi-people me-2"></i>
                                {!sidebarCollapsed && 'User Manager'}
                                {!sidebarCollapsed && (
                                    <i className={`bi ${userMenuExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} float-end`}></i>
                                )}
                            </button>
                            {!sidebarCollapsed && userMenuExpanded && (
                                <ul className="nav flex-column ms-3">
                                    <li className="nav-item">
                                        <button className="nav-link text-start w-100 border-0 bg-transparent text-white-50">
                                            <i className="bi bi-person-lines-fill me-2"></i>
                                            Ver Usuarios
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link text-start w-100 border-0 bg-transparent text-white-50">
                                            <i className="bi bi-person-plus me-2"></i>
                                            Agregar Usuario
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Product Manager */}
                        <li className="nav-item">
                            <button
                                className={`nav-link text-start w-100 border-0 ${activeMenu === 'products' ? 'bg-primary' : 'bg-transparent'} text-white`}
                                onClick={() => handleMenuClick('products')}
                            >
                                <i className="bi bi-box me-2"></i>
                                {!sidebarCollapsed && 'Product Manager'}
                                {!sidebarCollapsed && (
                                    <i className={`bi ${productMenuExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} float-end`}></i>
                                )}
                            </button>
                            {!sidebarCollapsed && productMenuExpanded && (
                                <ul className="nav flex-column ms-3">
                                    <li className="nav-item">
                                        <button className="nav-link text-start w-100 border-0 bg-transparent text-white-50">
                                            <i className="bi bi-box-seam me-2"></i>
                                            Ver Productos
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link text-start w-100 border-0 bg-transparent text-white-50">
                                            <i className="bi bi-plus-square me-2"></i>
                                            Agregar Producto
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 p-4">
                {activeMenu === 'dashboard' && renderDashboard()}
                {activeMenu === 'users' && renderUserManager()}
                {activeMenu === 'products' && renderProductManager()}
            </div>

            {/* Estilos CSS en línea */}
            <style>{`
                .sidebar {
                    width: 280px;
                    transition: width 0.3s ease;
                }
                .collapsed-sidebar {
                    width: 70px;
                    transition: width 0.3s ease;
                }
                .sidebar-nav .nav-link {
                    padding: 12px 20px;
                    border-radius: 0;
                    margin: 2px 8px;
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

export default Admin_Inicio;
// src/pages/admin/Admin_Dashboard.tsx
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/User';
import { useProducts } from '../../hooks/UseProducts';
import { UsuarioService } from '../../services/usuario.service';

/*
  Admin_Dashboard
  ----------------
  Página del panel de administración que resume información del sistema:
  - Carga usuarios desde la API y utiliza `useProducts()` para obtener productos.
  - Muestra estadísticas: total usuarios, total productos, usuarios DUOC, admins,
    productos por categoría y métricas rápidas (porcentaje DUOC, precio promedio, etc.).
*/
const Admin_Dashboard: React.FC = () => {
    // Estado local para la lista de usuarios
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Consumimos el hook de productos para obtener la lista actual
    const { productos } = useProducts(); // Usar el hook personalizado

    // Cargar usuarios desde la API al montar el componente
    useEffect(() => {
        const loadUsuarios = async () => {
            try {
                setLoading(true);
                const usuariosList = await UsuarioService.listar();
                setUsuarios(usuariosList);
                setError(null);
            } catch (err) {
                console.error('Error al cargar usuarios:', err);
                setError('Error al cargar los datos de usuarios');
            } finally {
                setLoading(false);
            }
        };

        loadUsuarios();
    }, []);

    // ----------------------
    // Funciones de estadísticas
    // ----------------------
    // Cada una es pequeña y legible; separamos la lógica para mantener el JSX limpio.
    const getTotalUsers = () => usuarios.length;
    const getTotalProducts = () => productos.length;
    const getDuocUsers = () => usuarios.filter(u => u.descuentoDuoc).length;
    const getAdminUsers = () => usuarios.filter(u => u.rol === 'admin').length;

    // Agrupa los productos por su campo `categoria` y cuenta cuántos hay por categoría
    const getProductsByCategory = () => {
        const categories: { [key: string]: number } = {};
        productos.forEach(p => {
            if (p.categoria) {
                categories[p.categoria] = (categories[p.categoria] || 0) + 1;
            }
        });
        return categories;
    };

    // Formatea nombres de categoría tipo 'img_mousepad' => 'Img Mousepad'
    const formatCategoria = (categoria: string): string => {
        return categoria.replace(/_/g, ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const categoriesData = getProductsByCategory();

    // ----------------------
    // JSX: estructura del dashboard
    // ----------------------
    // La UI está compuesta por tarjetas (cards) de Bootstrap que consumen las funciones
    // anteriores para mostrar los números. Intentamos evitar lógica pesada dentro del JSX.
    return (
        <div className="p-4">
            <div className="row g-4">
                <div className="col-12">
                    <h1 className="text-white mb-4">Dashboard de Administración</h1>
                </div>
                
                {loading ? (
                    <div className="col-12">
                        <div className="alert alert-info">Cargando datos...</div>
                    </div>
                ) : error ? (
                    <div className="col-12">
                        <div className="alert alert-danger">{error}</div>
                    </div>
                ) : (
                    <>
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

                        {/* Resumen rápido */}
                        <div className="col-12">
                            <div className="card bg-dark text-white">
                                <div className="card-header">
                                    <h5 className="mb-0">Resumen del Sistema</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row text-center">
                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted">Porcentaje DUOC</p>
                                            <h4 className="text-info">
                                                {getTotalUsers() > 0 ? Math.round((getDuocUsers() / getTotalUsers()) * 100) : 0}%
                                            </h4>
                                        </div>
                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted">Categorías activas</p>
                                            <h4 className="text-success">{Object.keys(categoriesData).length}</h4>
                                        </div>
                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted">Precio promedio</p>
                                            <h4 className="text-warning">
                                                ${productos.length > 0 ? 
                                                    Math.round(productos.reduce((sum, p) => sum + p.precio, 0) / productos.length).toLocaleString('es-ES') 
                                                    : 0
                                                }
                                            </h4>
                                        </div>
                                        <div className="col-md-3">
                                            <p className="mb-1 text-muted">Admin/User ratio</p>
                                            <h4 className="text-danger">
                                                {getTotalUsers() > 0 ? Math.round((getAdminUsers() / getTotalUsers()) * 100) : 0}%
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin_Dashboard;

/*
  Dónde se importa/usa este componente `Admin_Dashboard`:
  - src/App.tsx
    * Importa `Admin_Dashboard` y lo usa en una ruta del router. Ver `Route index element={<Admin_Dashboard />}`.

  Por qué:
  - Es la vista principal del área de administración que muestra métricas y un resumen
    rápido del estado del sistema (usuarios, productos, categorías).
*/
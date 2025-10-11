import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Importa los tipos desde sus nuevos archivos
import type { Product } from '../types/Product'; 
import type { UsuarioSesion } from '../types/User'; 

// Importa la base de datos simulada
import productosDB from '../data/productos.json'; 


// Función auxiliar para formatear la categoría para mostrarla en el menú (ej: "pc_gamer" -> "PC Gamer")
const formatearCategoria = (categoria: string): string => {
    // Reemplaza guiones bajos por espacios y capitaliza la primera letra de cada palabra
    const sinGuiones = categoria.replace(/_/g, ' ');
    return sinGuiones.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

const Header: React.FC = () => {
    // Obtiene el usuario actual desde localStorage (usando UsuarioSesion)
    const usuarioActualJSON = localStorage.getItem("usuarioActual");
    const usuarioActual: UsuarioSesion | null = usuarioActualJSON ? JSON.parse(usuarioActualJSON) : null;
    
    const navigate = useNavigate();

    // 2. LÓGICA PARA OBTENER CATEGORÍAS ÚNICAS (Solo se recalcula si productosDB cambia, que es poco probable)
    const categoriasUnicas: string[] = useMemo(() => {
        // Aseguramos el tipado correcto
        const productos: Product[] = productosDB as Product[];
        
        // 1. Extrae solo el campo 'categoria' y filtra los undefined
        const todasLasCategorias = productos.map(p => p.categoria).filter((cat): cat is string => typeof cat === 'string');
        
        // 2. Filtra para obtener solo los valores únicos
        return Array.from(new Set(todasLasCategorias));
    }, []); // El array vacío [] asegura que se ejecute solo una vez

    const handleCerrarSesion = (e: React.MouseEvent) => {
        e.preventDefault();
        localStorage.removeItem("usuarioActual");
        // Forzar recarga completa y navegar a /main
        window.location.href = '/main';
    };

    return (
        <nav style={{ width: '100%', height: '100%' }} className="navbar navbar-expand-sm navbar-dark bg-black">
            <div className="container-fluid">
                {/* Logo y Marca */}
                <Link to="/main">
                    <img src="/img/header/logo_sin_fondo.png" alt="Logo" style={{ width: '60px' }} />
                </Link>
                <Link className="navbar-brand ms-2" to="/main">Level-up Gamer</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mynavbar">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/sobreLEVEL-UP">¿Quienes somos?</Link>
                        </li>
                        
                        {/* 3. Menú de Productos y Categorías Dinámicas */}
                        <li className="nav-item dropdown">
                            {/* El data-bs-toggle="dropdown" es clave para que Bootstrap JS funcione */}
                            <Link 
                                className="nav-link dropdown-toggle" 
                                to="/productos" 
                                id="productosDropdown"
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                Productos
                            </Link>
                            
                            <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                                
                                {/* Link general a todos los productos */}
                                <li><Link className="dropdown-item" to="/productos">Ver Todo</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                
                                {/* Generación dinámica de categorías */}
                                {categoriasUnicas.map(categoria => (
                                    <li key={categoria}>
                                        <Link 
                                            className="dropdown-item" 
                                            // La ruta lleva a /productos con un query param para filtrar
                                            to={`/productos?categoria=${categoria}`}
                                        >
                                            {formatearCategoria(categoria)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        
                        <li className="nav-item">
                            <Link className="nav-link" to="/eventos">Eventos</Link>
                        </li>
                    </ul>

                    {/* Formulario de Búsqueda */}
                    <form className="d-flex" onSubmit={(e) => { e.preventDefault(); navigate(`/main?productoSearch=${(document.getElementById('productoSearch') as HTMLInputElement).value}`) }}>
                        <input className="form-control me-2" type="text" name="productoSearch" id="productoSearch" placeholder="Introduce tu búsqueda" />
                        <button className="btn btn-primary" type="submit">Buscar</button>
                    </form>

                    {/* Menú de Usuario (código sin cambios) */}
                    <a className="navbar-nav nav-link dropdown-toggle ms-3 align-items-end" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                        <img 
                            src={usuarioActual?.fotoPerfil || "/img/header/user-logo-generic-white-alt.png"} 
                            alt="Usuario" 
                            style={{ width: '60px' }}
                        />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                        {usuarioActual ? (
                            <>
                                <li><span className="dropdown-item-text">👤 {usuarioActual.username}</span></li>
                                <li><span className="dropdown-item-text">Level-Up: Nivel 1</span></li>
                                <li><Link className="dropdown-item" to="/perfil">Mi Perfil</Link></li>
                                <li><Link className="dropdown-item" to="/carrito">Mi Carrito</Link></li>
                                {usuarioActual.rol === "admin" && (
                                    <li><Link className="dropdown-item" to="/admin">Panel de Administración</Link></li>
                                )}
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#" onClick={handleCerrarSesion}>Cerrar Sesión</a></li>
                            </>
                        ) : (
                            <>
                                <li><Link className="dropdown-item" to="/register">Registro</Link></li>
                                <li><Link className="dropdown-item" to="/login">Iniciar Sesión</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
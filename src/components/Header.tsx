import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// 1. Importa los tipos desde sus nuevos archivos
import type { Product } from '../types/Product'; 
import type { UsuarioSesion } from '../types/User'; 

// Importa la base de datos simulada
import productosDB from '../data/productos.json'; 

// Header.tsx

// - Responsable: barra de navegación superior (logo, navegación, búsqueda, menú de usuario).
// - Aclaracion:
//    Inputs: ninguno (lee `localStorage.usuarioActual` para mostrar estado de sesión).
//    Outputs: navegaciones vía `react-router` y llamadas a `localStorage` (cerrar sesión).
//    Errores/edge-cases: si `productos.json` no tiene categorías, el menú de categorías estará vacío.


// Función auxiliar para formatear la categoría para mostrarla en el menú (ej: "pc_gamer" -> "PC Gamer")
const formatearCategoria = (categoria: string): string => {
    // Reemplaza guiones bajos por espacios y capitaliza la primera letra de cada palabra
    const sinGuiones = categoria.replace(/_/g, ' ');
    return sinGuiones.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

/**
 * Header component
 * - Muestra el logo, navegación principal, formulario de búsqueda y menú de usuario.
 * - Lee `localStorage.usuarioActual` para saber si hay sesión activa.
 * - Usa `useMemo` para generar la lista única de categorías a partir de `productos.json`.
 */
const Header: React.FC = () => {
    const usuarioActualJSON = localStorage.getItem("usuarioActual");
    const usuarioActual: UsuarioSesion | null = usuarioActualJSON ? JSON.parse(usuarioActualJSON) : null;
    
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');

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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm(''); // limpiar el input después de buscar
        }
    };

    return (
        // Barra de navegación principal (Bootstrap)
        // - `navbar-expand-sm`: se colapsa en pantallas pequeñas.
        // - `navbar-dark bg-black`: estilo oscuro.
        <nav style={{ width: '100%', height: '100%' }} className="navbar navbar-expand-sm navbar-dark bg-black">
            <div className="container-fluid">
                {/* Logo y Marca */}
                {/*
                    - El logo es un `Link` a la ruta principal `/main`.
                    - `alt` proporciona texto alternativo para accesibilidad.
                    - La marca (texto) también es un `Link` para volver al inicio.
                */}
                <Link to="/main">
                    <img src="/img/header/logo_sin_fondo.png" alt="Logo" style={{ width: '60px' }} />
                </Link>
                <Link className="navbar-brand ms-2" to="/main">Level-up Gamer</Link>

                {/* Botón toggler: visible en pantallas pequeñas para mostrar/ocultar el menú */}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Contenido colapsable del navbar */}
                <div className="collapse navbar-collapse" id="mynavbar">
                    <ul className="navbar-nav me-auto">
                        {/* Enlace a la página "Quiénes somos" */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/sobreLEVEL-UP">¿Quienes somos?</Link>
                        </li>
                        
                        {/* 3. Menú de Productos y Categorías Dinámicas */}
                        <li className="nav-item dropdown">
                            {/*
                                El `Link` actúa como disparador del dropdown.
                                - `data-bs-toggle="dropdown"` depende de Bootstrap JS para funcionar.
                                - `aria-expanded` indica el estado del dropdown para lectores de pantalla.
                            */}
                            <Link 
                                className="nav-link dropdown-toggle" 
                                to="/productos" 
                                id="productosDropdown"
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                Productos
                            </Link>
                            
                            {/* Menú desplegable: contiene enlace a todos los productos y luego categorías dinámicas */}
                            <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                                {/* Link general a todos los productos (sin filtros) */}
                                <li><Link className="dropdown-item" to="/productos">Ver Todo</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                
                                {/*
                                    Generación dinámica de categorías:
                                    - `categoriasUnicas` se obtiene con `useMemo` (para eficiencia).
                                    - Cada Link navega a `/productos` con query param `categoria`.
                                    - `formatearCategoria` convierte el slug (parte final de una URL) a texto legible.
                                */}
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
                        
                        {/* Enlace a la sección de eventos */}
                        <li className="nav-item">
                            <Link className="nav-link" to="/eventos">Eventos</Link>
                        </li>
                    </ul>

                    {/* Formulario de Búsqueda */}
                    {/*
                        - Envía el termino a la ruta `/productos?search=...`.
                        - `handleSearch` evita la recarga y navega usando `useNavigate()`.
                        - Se limpia el input después de buscar.
                    */}
                    <form className="d-flex" onSubmit={handleSearch} role="search">
                        <input 
                            className="form-control me-2" 
                            type="text" 
                            placeholder="Buscar productos..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Buscar productos"
                        />
                        <button className="btn btn-primary" type="submit" aria-label="Buscar">
                            <i className="bi bi-search" aria-hidden="true"></i>
                        </button>
                    </form>

                    {/* Menú de Usuario (código sin cambios) */}
                    {/*
                        - Muestra la foto de perfil si existe, o un placeholder.
                        - Al hacer click abre un dropdown con opciones que dependen de la sesión.
                        - `handleCerrarSesion` borra `localStorage.usuarioActual` y recarga a /main.
                    */}
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
                                {/* Enlace para que el cliente vea su historial de pedidos */}
                                <li><Link className="dropdown-item" to="/pedidos">Mis Pedidos</Link></li>
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

// Export por defecto: facilita la importación del componente en páginas y otros componentes.
export default Header;


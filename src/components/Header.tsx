// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Define la estructura del usuario (tipificación)
interface Usuario {
    username: string;
    rol: 'user' | 'admin';
    // Asumiendo que puedes tener una foto de perfil, aunque no se usa en el menú
    fotoPerfil?: string; 
}

const Header: React.FC = () => {
    // Obtiene el usuario actual desde localStorage (TypeScript requiere el tipado)
    const usuarioActualJSON = localStorage.getItem("usuarioActual");
    const usuarioActual: Usuario | null = usuarioActualJSON ? JSON.parse(usuarioActualJSON) : null;
    
    const navigate = useNavigate();

    const handleCerrarSesion = (e: React.MouseEvent) => {
        e.preventDefault();
        // Lógica de cierre de sesión
        localStorage.removeItem("usuarioActual");
        // Redirige usando el hook de React Router
        navigate("/main"); 
    };

    return (
        <nav style={{ width: '100%', height: '100%' }} className="navbar navbar-expand-sm navbar-dark bg-black">
            <div className="container-fluid">
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
                        <li className="nav-item dropdown">
                            <Link className="nav-link" to="/productos" id="productosDropdown">Productos</Link>
                            {/* Nota: Para que el dropdown funcione correctamente, necesitarías el JS de Bootstrap
                                cargado o usar un componente de React que maneje el estado de apertura.
                                Por simplicidad, dejamos el HTML, pero el manejo del estado sería ideal. */}
                            <ul className="dropdown-menu" aria-labelledby="productosDropdown">
                                <li><Link className="dropdown-item" to="/productos?categoria=figuras">Figuras</Link></li>
                                {/* ... [Añade el resto de tus categorías aquí] ... */}
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/eventos">Eventos</Link>
                        </li>
                    </ul>

                    {/* La búsqueda en React se manejaría con un hook que guarda el valor del input */}
                    <form className="d-flex" onSubmit={(e) => { e.preventDefault(); navigate(`/main?productoSearch=${(document.getElementById('productoSearch') as HTMLInputElement).value}`) }}>
                        <input className="form-control me-2" type="text" name="productoSearch" id="productoSearch" placeholder="Introduce tu búsqueda" />
                        <button className="btn btn-primary" type="submit">Buscar</button>
                    </form>

                    {/* Menú de Usuario */}
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
                                <li><Link className="dropdown-item" to="/registro">Registro</Link></li>
                                <li><Link className="dropdown-item" to="/inicio-sesion">Iniciar Sesión</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
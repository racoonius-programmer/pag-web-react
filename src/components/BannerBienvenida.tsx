import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Importa el tipo de sesión
import type { UsuarioSesion } from '../types/User'; 

// Función auxiliar para obtener el usuario desde localStorage
// (Nota: cambiamos el tipo de retorno para que coincida con UsuarioSesion)
const obtenerUsuarioActual = (): UsuarioSesion | null => {
    const usuarioJSON = localStorage.getItem("usuarioActual");
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
};

const BannerBienvenida: React.FC = () => {
    // Usamos el tipo UsuarioSesion en el estado
    const [usuarioLogueado, setUsuarioLogueado] = useState<UsuarioSesion | null>(null);


    // Carga el estado del usuario al montar el componente
    useEffect(() => {
        setUsuarioLogueado(obtenerUsuarioActual());
    }, []);

    if (usuarioLogueado) {
        // Lógica para Usuario Logueado (Admin o User)
        const isAdmin = usuarioLogueado.rol === 'admin';
        
        const mensajeBienvenida = isAdmin 
            ? (
                <>
                    <h2 className="text-light mb-2">¡Bienvenido, Administrador!</h2>
                    <p className="text-light mb-0">A sus órdenes, Señor Oscuro</p>
                </>
            )
            : (
                <>
                    <h2 className="text-light mb-2">¡Bienvenido, {usuarioLogueado.username}!</h2>
                    <p className="text-light mb-0">¡Explora nuestra tienda y descubre las últimas figuras de colección!</p>
                </>
            );

        const botonesAccion = isAdmin 
            ? (
                <Link to="/admin" className="btn btn-danger me-2">Panel de Administración</Link>
            )
            : (
                <>
                    <Link to="/productos" className="btn btn-primary me-2">Ver productos</Link>
                    <Link to="/carrito" className="btn btn-success">Ir al carrito</Link>
                </>
            );
        
        return (
            <div className="container my-5 p-4 bg-dark rounded shadow d-flex align-items-center justify-content-between">
                <div>{mensajeBienvenida}</div>
                <div>{botonesAccion}</div>
            </div>
        );

    } else {
        // Lógica para Usuario NO Logueado
        return (
            <div className="container my-5 p-4 bg-dark rounded shadow d-flex align-items-center justify-content-between">
                <div>
                    <h2 className="text-light mb-2">¡Bienvenido!</h2>
                    <p className="text-light mb-0">
                        Para una mejor experiencia, por favor,{' '}
                        <Link to="/login" className="text-primary text-decoration-underline">inicia sesión</Link>{' '}
                        o{' '}
                        <Link to="/register" className="text-success text-decoration-underline">regístrate</Link>.
                    </p>
                </div>
                <div>
                    <Link to="/login" className="btn btn-primary me-2">Iniciar sesión</Link>
                    <Link to="/register" className="btn btn-success">Registrarse</Link>
                </div>
            </div>
        );
    }
};

export default BannerBienvenida;
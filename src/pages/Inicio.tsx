import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// 1. Definición de Tipos (Replicamos la estructura del usuario)
interface Usuario {
    username: string;
    rol: 'user' | 'admin';
}

// Función auxiliar para obtener el usuario desde localStorage
const obtenerUsuarioActual = (): Usuario | null => {
    const usuarioJSON = localStorage.getItem("usuarioActual");
    return usuarioJSON ? JSON.parse(usuarioJSON) : null;
};

// 2. Componente de la pantalla principal
const MainScreen: React.FC = () => {
    // Estado para manejar el usuario logueado
    const [usuarioLogueado, setUsuarioLogueado] = useState<Usuario | null>(null);

    // Lógica del script de bienvenida (se ejecuta al cargar el componente)
    useEffect(() => {
        setUsuarioLogueado(obtenerUsuarioActual());
    }, []);

    // 3. Renderizado Condicional del Mensaje de Bienvenida
    const renderBienvenida = () => {
        if (usuarioLogueado) {
            // Usuario Logueado (Admin o User)
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
                // Reemplaza a id="bienvenida-container"
                <div className="container my-5 p-4 bg-dark rounded shadow d-flex align-items-center justify-content-between">
                    <div>{mensajeBienvenida}</div>
                    <div>{botonesAccion}</div>
                </div>
            );

        } else {
            // Usuario NO Logueado
            return (
                <div className="container my-5 p-4 bg-dark rounded shadow d-flex align-items-center justify-content-between">
                    <div>
                        <h2 className="text-light mb-2">¡Bienvenido!</h2>
                        <p className="text-light mb-0">
                            Para una mejor experiencia, por favor
                            <Link to="/inicio-sesion" className="text-primary text-decoration-underline ms-1">inicia sesión</Link>
                            o
                            <Link to="/registro" className="text-success text-decoration-underline ms-1">regístrate</Link>.
                        </p>
                    </div>
                    <div>
                        <Link to="/inicio-sesion" className="btn btn-primary me-2">Iniciar sesión</Link>
                        <Link to="/registro" className="btn btn-success">Registrarse</Link>
                    </div>
                </div>
            );
        }
    };


    return (
        <div style={{ backgroundColor: 'black' }} className="pb-5">

            {/* Contenedor de Bienvenida Dinámico */}
            {renderBienvenida()}

            {/* Carrusel */}
            <div id="carrusel" className="carousel slide" data-bs-ride="carousel">

                {/* Indicators/dots */}
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carrusel" data-bs-slide-to={0} className="active"></button>
                    <button type="button" data-bs-target="#carrusel" data-bs-slide-to={1}></button>
                    <button type="button" data-bs-target="#carrusel" data-bs-slide-to={2}></button>
                </div>

                <div className="carousel-inner">
                    {/* Primer Slider */}
                    <div className="carousel-item active">
                        <img src="/img/main/gamer_stock.png" alt="Inicio" className="d-block w-100" />
                        <div className="orbitron carousel-caption d-flex flex-column justify-content-center h-100">
                            <h1 className="fw-bolder display-3 display-md-2 display-sm-5" style={{ textShadow: '4px 1px 4px rgba(0,0,0,0.7)' }}>
                                Level-up Gamer
                            </h1>
                            <p className="roboto fs-2 fs-md-4 fs-sm-6" style={{ textShadow: '4px 1px 4px rgba(0,0,0,0.7)' }}>Tu lugar para todo lo relacionado con videojuegos</p>
                        </div>
                    </div>
                    {/* Segundo Slider */}
                    <div className="carousel-item">
                        <img src="/img/main/componentes.png" alt="Componentes" className="d-block w-100" />
                        <div className="carousel-caption d-flex flex-column justify-content-center h-100">
                            <h1 className="orbitron fw-bolder display-3 display-md-2 display-sm-5" style={{ textShadow: '4px 1px 4px rgba(0,0,0,1)' }}>
                                Arma tu PC como un Pro
                            </h1>
                            <p className="fw-bolder roboto fs-2 fs-md-4 fs-sm-6" style={{ textShadow: '4px 4px 4px rgb(0, 0, 0)' }}>
                                Encuentra componentes de última generación
                            </p>
                        </div>
                    </div>
                    {/* Tercer Slide */}
                    <div className="carousel-item">
                        <img src="/img/main/ps_logo_stock.jpg" alt="Juegos" className="d-block w-100" />
                        <div className="carousel-caption d-flex flex-column justify-content-center h-100">
                            <h1 className="orbitron fw-bolder display-3 display-md-2 display-sm-5" style={{ textShadow: '4px 1px 4px rgba(0,0,0,0.7)' }}>
                                Conéctate al mundo Gamer
                            </h1>
                            <p className="roboto fs-2 fs-md-4 fs-sm-6" style={{ textShadow: '4px 1px 4px rgba(0,0,0,0.7)' }}>
                                Comunidad, merch y más
                            </p>
                        </div>
                    </div>

                    {/* Controles del carrusel */}
                    <button className="carousel-control-prev" type="button" data-bs-target="#carrusel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon"></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carrusel" data-bs-slide="next">
                        <span className="carousel-control-next-icon"></span>
                    </button>
                </div>
            </div>


            {/* Sección "Lo más vendido" (Placeholder) */}
            <div data-bs-theme="dark">
                <br />
                <h1 style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '10px' }} className="text-light">Lo más vendido</h1>
                <div className="container py-5">
                    <div className="row justify-content-center" id="mas-vendidos">
                        <p className='text-center text-muted'>Aquí irán las tarjetas de productos.</p>
                    </div>
                </div>
            </div>

            {/* Banner de Whatsapp */}
            <div className="container">
                <a href="https://api.whatsapp.com/send?phone=56984543683&text=¡Hola!" className="link-completo">
                    <div className="mt-4 p-5 bg-verde-neon text-white rounded d-flex justify-content-between align-items-center">
                        <div>
                            <h1>¿Necesitas servicio técnico?</h1>
                            <p>Contáctanos a nuestro Whatsapp</p>
                        </div>
                        <img src="/img/main/whatsapp-logo.png" alt="whatsapp-logo" className="img-fluid" style={{ maxWidth: '150px' }} />
                    </div>
                </a>
            </div>
            
        </div>
    );
};

export default MainScreen;
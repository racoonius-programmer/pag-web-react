import React from 'react';

// NOTA: Asumimos que las fuentes (Roboto, Orbitron) y el CSS global
// (incluyendo Bootstrap y los archivos de estilos locales) ya están
// importados en el punto de entrada de tu aplicación (ej: index.html o main.tsx).

const SobreLevelUp: React.FC = () => {
    // El estilo 'background-color: black' del <body> se aplica al contenedor principal
    return (
        // data-bs-theme="dark" es una buena práctica de Bootstrap para indicar el tema
        <div className="m-0" style={{ backgroundColor: 'black', minHeight: '100vh' }}>
            
            <div className="container py-5">
                
                {/* Primera Sección: Logo y Quiénes Somos */}
                <section className="row align-items-center mb-5">
                    
                    {/* Columna del Logo (4/12) */}
                    <div className="col-lg-4 text-center mb-4 mb-lg-0">
                        <img 
                            src="img/header/logo_sin_fondo.png" 
                            alt="Level-Up Gamer Logo" 
                            className="img-fluid"
                            style={{ maxWidth: '250px' }}
                        />
                    </div>

                    {/* Columna de la Descripción (8/12) */}
                    <div className="col-lg-8">
                        <div className="card bg-dark border rounded p-4">
                            <div className="card-body">
                                
                                <h2 className="card-title text-warning roboto fw-bold mb-3">Tu tienda gamer en Chile</h2>
                                
                                <p className="fs-5 lh-base" style={{ color: 'white' }}>
                                    Level-Up Gamer es una tienda online dedicada a satisfacer las necesidades de los entusiastas
                                    de los videojuegos en Chile. Lanzada hace dos años como respuesta a la creciente demanda
                                    durante la pandemia, ofrece una amplia gama de productos para gamers, desde consolas y
                                    accesorios hasta computadores y sillas especializadas. Aunque no cuenta con una ubicación
                                    física, realiza despachos a todo el país.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Segunda Sección: Misión y Visión --- */}
                
                {/* g-4 establece el espacio (gutter) entre las columnas */}
                <section className="row g-4 text-center">
                    
                    {/* Tarjeta de Misión (6/12) */}
                    <div className="col-md-6">
                        <div className="card bg-dark border rounded p-4">
                            <div className="card-body">
                                <h3 className="card-title text-warning roboto-font fw-bold">Nuestra Misión</h3>
                                <p className="fs-5 lh-base" style={{ color: 'white' }}>
                                    Proporcionar productos de alta calidad para gamers en todo Chile, ofreciendo una experiencia
                                    de compra única y personalizada, con un enfoque en la satisfacción del cliente y el
                                    crecimiento de la comunidad gamer.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta de Visión (6/12) */}
                    <div className="col-md-6">
                        <div className="card bg-dark border rounded p-4">
                            <div className="card-body">
                                <h3 className="card-title text-warning roboto-font fw-bold">Nuestra Visión</h3>
                                <p className="fs-5 lh-base" style={{ color: 'white' }}>
                                    Ser la tienda online líder en productos para gamers en Chile, reconocida por su innovación,
                                    servicio al cliente excepcional, y un programa de fidelización basado en gamificación que
                                    recompense a nuestros clientes más fieles.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SobreLevelUp;
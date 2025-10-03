import React from 'react';

const CarruselPrincipal: React.FC = () => {
    return (
        // Carrusel (Reemplaza a id="carrusel" de main.html)
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
    );
};

export default CarruselPrincipal;
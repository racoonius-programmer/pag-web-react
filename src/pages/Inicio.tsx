// src/pages/Inicio.tsx
import React from 'react';
import CarruselPrincipal from '../components/Carousel'; 
import BannerBienvenida from '../components/BannerBienvenida'; 
import BannerWhatsApp from '../components/BannerWhatsapp'; 
import ProductosDestacados from '../components/ProductDestacados';
// No se necesita importar Link, useEffect, useState, o la lógica de usuario aquí.

const MainScreen: React.FC = () => {
//Llamamos todos los componentes
    return (
        <div style={{ backgroundColor: 'black' }} className="pb-5">

            {/* El banner de bienvenida, si no te gusta como componente quiza lo dejamos aca. */}
            <BannerBienvenida />

            {/* El carrusel de inicio */}
            <CarruselPrincipal />

            {/* Sección "Lo más vendido"*/}
            <ProductosDestacados/>

            {/* 3. Componente modularizado */}
            <BannerWhatsApp />
            
        </div>
    );
};

export default MainScreen;
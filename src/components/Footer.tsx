// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

// Componente Footer
// - Muestra enlaces de navegación rápidos, derechos de autor y enlaces a redes sociales.
// - Diseñado para colocarse al final de la página (layout global).

const Footer: React.FC = () => {
    return (
        <footer className="py-3 bg-black orbitron ">
            {/*
                Navegación interna (React Router Link):
                - Usamos `Link` para navegar sin recargar la página.
                - Cada `li` es un elemento de la lista de navegación.
            */}
            <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                <li className="nav-item"><Link to="/main" className="nav-link px-2 text-light">Inicio</Link></li>
                <li className="nav-item"><Link to="/contacto" className="nav-link px-2 text-light">Contacto</Link></li>
                <li className="nav-item"><Link to="/sobreLEVEL-UP" className="nav-link px-2 text-light">¿Quiénes somos?</Link></li>
            </ul>

            {/* Derechos de autor / marca */}
            <p className="text-center text-light">© 2025 Level-Up Gamer</p>

            {/* Enlaces a redes sociales (externos) */}
            <div className="text-center mb-3">
                <a href="https://facebook.com/ficticio" target="_blank" className="text-light px-2">
                    <i className="bi bi-facebook fs-4"></i>
                </a>
                <a href="https://instagram.com/ficticio" target="_blank" className="text-light px-2">
                    <i className="bi bi-instagram fs-4"></i>
                </a>
                <a href="https://twitter.com/ficticio" target="_blank" className="text-light px-2">
                    <i className="bi bi-twitter fs-4"></i>
                </a>
            </div>
        </footer>
    );
};
// Export por defecto para importarlo fácilmente en paginas
export default Footer;
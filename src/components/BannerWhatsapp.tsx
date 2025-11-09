import React from 'react';

// Componente: BannerWhatsApp
// Muestra un banner/link grande que abre una conversación en WhatsApp.
// Está pensado para colocarse en la home o en páginas de contacto.
const BannerWhatsApp: React.FC = () => {
    return (
        // Contenedor principal con clases de Bootstrap para espaciado
        <div className="container">
            {/*
                Enlace que abre la API de WhatsApp con número y texto predefinido.
                - Cambia el parámetro `phone` por el número que uses (con código país, solo dígitos).
                - El `text` puede codificarse si necesitas caracteres especiales.
            */}
            <a href="https://api.whatsapp.com/send?phone=56984543683&text=¡Hola!" className="link-completo">
                {/*
                    Banner visual:
                    - Usamos utilidades de Bootstrap para espaciado y alineación.
                */}
                <div className="mt-4 p-5 bg-verde-neon text-white rounded d-flex justify-content-between align-items-center">
                    <div>
                        {/* Título y texto descriptivo del banner */}
                        <h1>¿Necesitas servicio técnico?</h1>
                        <p>Contáctanos a nuestro Whatsapp</p>
                    </div>
                    {/*
                        Imagen del logo de WhatsApp:
                        - Debe existir en `public/img/main/whatsapp-logo.png` para que se muestre correctamente.
                        - `img-fluid` hace la imagen responsiva y el style limita el ancho máximo.
                    */}
                    <img src="/img/main/whatsapp-logo.png" alt="whatsapp-logo" className="img-fluid" style={{ maxWidth: '150px' }} />
                </div>
            </a>
        </div>
    );
};

// Export por defecto para poder importar este banner en páginas
export default BannerWhatsApp;
import React from 'react';

const BannerWhatsApp: React.FC = () => {
    return (
        <div className="container">
            <a href="https://api.whatsapp.com/send?phone=56984543683&text=¡Hola!" className="link-completo">
                {/* Nota: la clase 'bg-verde-neon' debe estar definida en tu CSS. Usamos bg-secondary como fallback. */}
                <div className="mt-4 p-5 bg-verde-neon text-white rounded d-flex justify-content-between align-items-center">
                    <div>
                        <h1>¿Necesitas servicio técnico?</h1>
                        <p>Contáctanos a nuestro Whatsapp</p>
                    </div>
                    {/* La imagen debe estar en public/img/main/ */}
                    <img src="/img/main/whatsapp-logo.png" alt="whatsapp-logo" className="img-fluid" style={{ maxWidth: '150px' }} />
                </div>
            </a>
        </div>
    );
};

export default BannerWhatsApp;
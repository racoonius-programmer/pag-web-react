import React from 'react';
// Tipo que describe la estructura de un evento (título, descripción, imagen...)
import type { Evento } from '../types/Evento'; 

// Props que recibe este componente: un solo objeto `evento` de tipo Evento
interface EventCardProps {
    evento: Evento;
}

// Componente: EventCard
// - Propósito: mostrar la información básica de un evento (imagen, título, descripción)
// - Uso típico: renderizar dentro de una lista de eventos en una página de eventos
const EventCard: React.FC<EventCardProps> = ({ evento }) => {
    return (
        // Columna responsiva (Bootstrap) que contiene la tarjeta del evento
        <div className="col-md-6">
            {/* Tarjeta oscura con borde y altura completa para alinear tarjetas en la grid */}
            <div className="card bg-dark border rounded h-100">
                {/*
                    Imagen del evento:
                    - `evento.imagenSrc` es la ruta de la imagen (puede ser relativa a public/ o URL externa).
                    - Se centra con clases de utilidades y se limita el ancho con `w-75`.
                    - `evento.imagenAlt` debe contener texto alternativo accesible.
                    
                */}
                <img 
                    src={evento.imagenSrc} 
                    className="card-img-top w-75 mx-auto mt-3 rounded"
                    alt={evento.imagenAlt}
                />

                {/* Cuerpo de la tarjeta: título y descripción */}
                <div className="card-body d-flex flex-column">
                    {/* Título del evento: estilo y fuente */}
                    <h5 className="card-title text-light roboto-font fw-bold">
                        {evento.titulo}
                    </h5>
                    {/*
                        Descripción: ocupa el espacio restante (flex-grow-1) para alinear
                        todas las tarjetas con la misma altura dentro de la fila.
                    */}
                    <p className="fs-6 lh-base flex-grow-1" style={{ color: 'white' }}>
                        {evento.descripcion}
                    </p>
                </div>
            </div>
        </div>
    );
};

// Export por defecto para importarlo fácilmente en listas/páginas de eventos
export default EventCard;

/*
    Archivos que importan/usan este componente `EventCard` (EventosCard.tsx):

    - src/pages/Events.tsx
        Razón: página que carga los datos de `src/data/eventos.json`, los convierte
                     a `Evento[]` y mapea cada objeto para renderizar un `EventCard`.
*/



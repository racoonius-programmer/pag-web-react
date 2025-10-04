import React from 'react';
// Importamos el type Evento desde el nuevo archivo de tipos
import type { Evento } from '../types/Evento'; 

interface EventCardProps {
    evento: Evento;
}

const EventCard: React.FC<EventCardProps> = ({ evento }) => {
    return (
        <div className="col-md-6">
            <div className="card bg-dark border rounded h-100">
                <img 
                    src={evento.imagenSrc} 
                    className="card-img-top w-75 mx-auto mt-3 rounded"
                    alt={evento.imagenAlt}
                />
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-light roboto-font fw-bold">
                        {evento.titulo}
                    </h5>
                    <p className="fs-6 lh-base flex-grow-1" style={{ color: 'white' }}>
                        {evento.descripcion}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
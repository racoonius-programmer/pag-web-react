// src/pages/Events.tsx
import React from 'react';
import EventCard from '../components/EventosCard';
// 🚨 Importación desde el archivo JSON
import eventosData from '../data/eventos.json'; 
// Importamos el type para tipificar correctamente la data JSON
import type { Evento } from '../types/Evento'; 


const Events: React.FC = () => {
    
    // Convertimos los datos JSON al tipo correcto para asegurar la compatibilidad con TypeScript
    const eventos: Evento[] = eventosData as Evento[];

    return (
        <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
            <div className="container py-5" data-bs-theme="dark">
                
                <h2 className="text-light text-center mb-5 orbitron-font">Próximos Eventos</h2>

                <section className="row g-4 text-center align-items-stretch">
                    {eventos.map(evento => (
                        <EventCard key={evento.id} evento={evento} />
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Events;
// src/pages/Events.tsx
import React from 'react';
import EventCard from '../components/EventosCard';
// Importación desde el archivo JSON
import eventosData from '../data/eventos.json';
// Importamos el type para tipificar correctamente la data JSON
import type { Evento } from '../types/Evento';


const Events: React.FC = () => {
    /*
        Página: Events
        -----------------
        Muestra una lista de eventos próximos leyendo los datos desde un JSON
        local (`src/data/eventos.json`) y renderizando un `EventCard` por cada
        objeto de evento.

        Qué hace :
        - Importamos `eventosData` (JSON) y lo casteamos a `Evento[]` para que
            TypeScript nos ayude a detectar usos incorrectos de la estructura.
        - Recorremos `eventos` con `map` y por cada elemento renderizamos
            `EventCard`, pasando el objeto `evento` como prop.
        - La página usa utilidades de Bootstrap (clases) y aplica un tema oscuro.
    */

    // Convertimos los datos JSON al tipo `Evento[]` para mayor seguridad con TS.
    const eventos: Evento[] = eventosData as Evento[];

    return (
        <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
            <div className="container py-5" data-bs-theme="dark">

                {/* Título de la página */}
                <h2 className="text-light text-center mb-5 orbitron-font">Próximos Eventos</h2>

                {/*
                    Listado de eventos:
                    - Usamos una `<section>` con grilla Bootstrap (`row g-4`).
                    - `align-items-stretch` ayuda a que las tarjetas tengan la misma altura.
                                */}
                <section className="row g-4 text-center align-items-stretch">
                    {eventos.map(evento => (
                        <React.Fragment key={evento.id}>
                            {/*
                                Por cada evento renderizamos un `EventCard` pasando el objeto
                                completo. Usamos `evento.id` como `key` (clave única).
                                                                        */}
                            <EventCard evento={evento} />
                        </React.Fragment>
                    ))}
                </section>
            </div>
        </div>
    );
};

export default Events;

/*
    Archivos que importan / usan `Events` (y por qué):
    - `src/App.tsx`:
            - Monta `Events` en la ruta `/eventos`. Permite acceder a la lista pública de eventos.

    Nota rápida:
    - Si decides cargar eventos desde una API, añade estado local (loading, error)
        y reemplaza la importación estática por una llamada en `useEffect`.
*/
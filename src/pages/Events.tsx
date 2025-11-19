// src/pages/Events.tsx
import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventosCard';
// Importamos el type para tipificar correctamente la data de la API
import type { Evento } from '../types/Evento';

const Events: React.FC = () => {
    /*
        Página: Events
        -----------------
        Muestra una lista de eventos próximos cargando los datos desde una API
        que expone la tabla eventos. Renderiza un `EventCard` por cada
        objeto de evento obtenido.

        Qué hace:
        - Usa `useState` para manejar el estado de los eventos, loading y errores.
        - Usa `useEffect` para hacer la llamada a la API al montar el componente.
        - Recorre `eventos` con `map` y por cada elemento renderiza
            `EventCard`, pasando el objeto `evento` como prop.
        - La página usa utilidades de Bootstrap (clases) y aplica un tema oscuro.
    */

    // Estados para manejar los datos y el estado de la aplicación
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Hook para cargar los eventos desde la API
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Realizar la petición a la API
                const response = await fetch('/api/eventos');
                
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                setEventos(data);
            } catch (err) {
                console.error('Error al cargar eventos:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido al cargar eventos');
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, []);

    return (
        <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
            <div className="container py-5" data-bs-theme="dark">

                {/* Título de la página */}
                <h2 className="text-light text-center mb-5 orbitron-font">Próximos Eventos</h2>

                {/* Estado de carga */}
                {loading && (
                    <div className="text-center text-light">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Cargando eventos...</span>
                        </div>
                        <p className="mt-3">Cargando eventos...</p>
                    </div>
                )}

                {/* Estado de error */}
                {error && !loading && (
                    <div className="alert alert-danger text-center" role="alert">
                        <h4 className="alert-heading">Error al cargar eventos</h4>
                        <p>{error}</p>
                        <button 
                            className="btn btn-outline-danger"
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Lista de eventos */}
                {!loading && !error && eventos.length > 0 && (
                    <section className="row g-4 text-center align-items-stretch">
                        {eventos.map(evento => (
                            <React.Fragment key={evento.id}>
                                <EventCard evento={evento} />
                            </React.Fragment>
                        ))}
                    </section>
                )}

                {/* Mensaje cuando no hay eventos */}
                {!loading && !error && eventos.length === 0 && (
                    <div className="text-center text-light">
                        <h4>No hay eventos disponibles en este momento</h4>
                        <p>Vuelve pronto para ver las próximas actividades.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;

/*
    Archivos que importan / usan `Events` (y por qué):
    - `src/App.tsx`:
            - Monta `Events` en la ruta `/eventos`. Permite acceder a la lista pública de eventos.

    Cambios realizados:
    - Reemplazada importación estática del JSON por llamada a API.
    - Añadido manejo de estados: loading, error y datos.
    - Implementado useEffect para cargar datos al montar el componente.
    - Añadidas interfaces de usuario para estados de carga y error.
    - Mensaje informativo cuando no hay eventos disponibles.
*/
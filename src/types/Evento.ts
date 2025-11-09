export interface Evento {
                id: number;
                imagenSrc: string;
                imagenAlt: string;
                titulo: string;
                descripcion: string;
}

/*
    Archivos que importan/usan este tipo (`Evento`):

    - src/pages/Events.tsx
        Razón: convierte los datos JSON de `src/data/eventos.json` a `Evento[]`
        y mapea esos objetos para renderizar tarjetas/filas de eventos.

    - src/components/EventosCard.tsx
        Razón: componente que recibe un `evento: Evento` como prop y muestra
                                                la imagen, título y descripción. Se usa desde `Events.tsx`.

*/


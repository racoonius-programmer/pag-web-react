// src/components/RegionComunaSelects.tsx
// Componente pequeño y reutilizable que renderiza dos <select>: Región y Comuna.
// - Lee la lista de regiones/comunas desde `public/data/chileGeo.json`.
// - Es controlado por props: el padre mantiene `currentRegion` y `currentComuna`.
import React, { useState, useEffect, useCallback } from 'react';

// Props que el padre debe pasar a este componente
interface RegionComunaProps {
    // Llamado cuando cambia la región seleccionada
    onRegionChange: (region: string) => void;
    // Llamado cuando cambia la comuna seleccionada
    onComunaChange: (comuna: string) => void;
    // Valores controlados desde el padre (estado fuente)
    currentRegion: string;
    currentComuna: string;
}

// Forma de los datos cargados desde el JSON (cada región tiene lista de comunas)
interface RegionData {
    region: string;
    comunas: string[];
}

const RegionComunaSelects: React.FC<RegionComunaProps> = ({ 
    onRegionChange, 
    onComunaChange, 
    currentRegion, 
    currentComuna 
}) => {
    // Estado local: lista de regiones (cargada desde el JSON) y comunas disponibles según la región
    const [regiones, setRegiones] = useState<RegionData[]>([]);
    const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);

    // Efecto: cargar las regiones/comunas desde el JSON público una sola vez al montar.
    // El archivo está en `public/data/chileGeo.json` 
    useEffect(() => {
        fetch('/data/chileGeo.json')
            .then(res => res.json())
            .then(data => setRegiones(data.regiones))
            .catch(() => setRegiones([]));
    }, []);

    // Actualizar comunas cuando cambia la región
    // Efecto: cuando `currentRegion` cambia, buscamos las comunas de esa región y las ponemos
    // en `comunasDisponibles`. Si no hay región seleccionada, limpiamos comunas y notificamos
    // al padre que la comuna queda vacía (onComunaChange("")).
    useEffect(() => {
        const regionEncontrada = regiones.find(r => r.region === currentRegion);
        if (regionEncontrada) {
            setComunasDisponibles(regionEncontrada.comunas);
        } else {
            setComunasDisponibles([]);
            onComunaChange("");
        }
    }, [currentRegion, onComunaChange, regiones]);
    
    // Función de cambio para la Región
    // Handler cuando el usuario selecciona una región
    // - Llama a onRegionChange con la región seleccionada
    // - Resetea la comuna (porque las comunas dependen de la región)
    const handleRegionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegion = e.target.value;
        onRegionChange(selectedRegion);
        onComunaChange(""); // Resetear la comuna al cambiar la región
    }, [onRegionChange, onComunaChange]);
    
    // Función de cambio para la Comuna
    // Handler cuando el usuario selecciona una comuna: delega al padre
    const handleComunaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onComunaChange(e.target.value);
    }, [onComunaChange]);

    return (
        <div className="row">
            {/* Selección de región */}
            <div className="col-md-6 mb-3">
                <label htmlFor="elegirRegion" className="form-label text-light">Región</label>
                <select 
                    id="elegirRegion" 
                    className="form-select"
                    value={currentRegion}
                    onChange={handleRegionChange}
                    required // Aquí mantenemos el atributo HTML 'required'
                >
                    <option value="">Seleccione una región</option>
                    {regiones.map((r) => (
                        <option key={r.region} value={r.region}>
                            {r.region}
                        </option>
                    ))}
                </select>
            </div>

            {/* Selección de comuna */}
            <div className="col-md-6 mb-3">
                <label htmlFor="elegirComuna" className="form-label text-light">Comuna</label>
                <select 
                    id="elegirComuna" 
                    className="form-select"
                    value={currentComuna}
                    onChange={handleComunaChange}
                    disabled={!currentRegion} // Deshabilitado si no hay región seleccionada
                    required
                >
                    <option value="">{currentRegion ? "Seleccione una comuna" : "Seleccione una región primero"}</option>
                    {comunasDisponibles.map((comuna) => (
                        <option key={comuna} value={comuna}>
                            {comuna}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default RegionComunaSelects;

/*
  Dónde se usa este componente:
  - src/pages/User_Register.tsx  (formulario de registro de usuario)
  - src/pages/UserPerfil.tsx     (edición del perfil de usuario)

  Resumen rápido:
  - El componente no mantiene el estado de la región/comuna; el padre lo controla.
  - Cuando el usuario selecciona una región, este componente llama `onRegionChange(region)`
    y resetea la comuna a cadena vacía llamando `onComunaChange("")`.
  - Cuando selecciona una comuna llama `onComunaChange(comuna)`.
  - Las listas de regiones/comunas se cargan una vez desde `/data/chileGeo.json`.
*/
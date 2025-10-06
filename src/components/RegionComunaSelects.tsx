// src/components/RegionComunaSelects.tsx
import React, { useState, useEffect, useCallback } from 'react';

interface RegionComunaProps {
    onRegionChange: (region: string) => void;
    onComunaChange: (comuna: string) => void;
    currentRegion: string;
    currentComuna: string;
}

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
    const [regiones, setRegiones] = useState<RegionData[]>([]);
    const [comunasDisponibles, setComunasDisponibles] = useState<string[]>([]);

    // Cargar regiones desde el JSON en public/data/chileGeo.json
    useEffect(() => {
        fetch('/data/chileGeo.json')
            .then(res => res.json())
            .then(data => setRegiones(data.regiones))
            .catch(() => setRegiones([]));
    }, []);

    // Actualizar comunas cuando cambia la región
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
    const handleRegionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegion = e.target.value;
        onRegionChange(selectedRegion);
        onComunaChange(""); // Resetear la comuna al cambiar la región
    }, [onRegionChange, onComunaChange]);
    
    // Función de cambio para la Comuna
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
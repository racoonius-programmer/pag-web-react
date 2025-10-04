// src/hooks/RegionesComunas.ts

import { useState, useMemo, useCallback, useEffect } from 'react';
// import regionesData from '../data/chileGeo.json'; // Simulación

// Simulación de los datos de regiones que usaría el hook
const CHILE_REGIONS = [
    { region: "Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre"] },
    // ... (el resto de las regiones)
    { region: "Región Metropolitana de Santiago", comunas: ["Cerrillos", "Cerro Navia", "Conchalí", "Santiago"] },
]; 

export function useRegionesComunas() {
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedComuna, setSelectedComuna] = useState('');
    
    // Función de cambio de Región (Firma para RegionComunaSelects)
    const handleRegionChange = useCallback((region: string) => {
        setSelectedRegion(region);
        setSelectedComuna(''); // Siempre resetear la comuna
    }, []);
    
    // Función de cambio de Comuna (Firma para RegionComunaSelects)
    const handleComunaChange = useCallback((comuna: string) => {
        setSelectedComuna(comuna);
    }, []);

    // NOTA: Si el componente RegionComunaSelects ya maneja la lógica de las comunas disponibles,
    // este hook solo necesita retornar el estado y los setters que coincidan con su props.

    return {
        // Opciones de regiones NO se devuelven si el componente las maneja internamente.
        // Si el componente las necesita, se tendrían que exponer (como antes).
        // Si las opciones se usan internamente en el componente:
        // regionesOptions: CHILE_REGIONS.map(r => r.region), 
        // comunasOptions: (CHILE_REGIONS.find(r => r.region === selectedRegion)?.comunas || []),
        
        selectedRegion,
        selectedComuna,
        handleRegionChange, // Ahora recibe string
        handleComunaChange, // Ahora recibe string
    };
}
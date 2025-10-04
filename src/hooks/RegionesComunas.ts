import { useState, useEffect, useCallback, useMemo } from 'react';

// Define las interfaces para la data cruda
interface ComunaRegionData {
  region: string;
  comunas: string[];
}

// Define la interfaz para las opciones del selector (más limpio para React)
interface Option {
    value: string;
    label: string;
}

/**
 * Custom Hook para cargar y gestionar la selección de Regiones y Comunas de Chile.
 * * Este hook asume que el archivo 'chileGeo.json' está en la ruta /json/chileGeo.json.
 * * @param initialRegion Región seleccionada inicialmente (opcional).
 * @param initialComuna Comuna seleccionada inicialmente (opcional).
 */
export function useRegionesComunas(initialRegion: string = '', initialComuna: string = '') {
  // Estado para la data cruda cargada del JSON
  const [regionesData, setRegionesData] = useState<ComunaRegionData[]>([]);
  
  // Estado para las selecciones del usuario
  const [selectedRegion, setSelectedRegion] = useState(initialRegion);
  const [selectedComuna, setSelectedComuna] = useState(initialComuna);
  
  // Estado de carga
  const [isLoading, setIsLoading] = useState(true);

  // --- LÓGICA DE CARGA DE DATOS (Se ejecuta solo una vez) ---
  useEffect(() => {
    const JSON_PATH = "/data/chileGeo.json"; // 🚨 VERIFICA ESTA RUTA EN TU PROYECTO 🚨

    async function cargarRegiones() {
      setIsLoading(true);
      try {
        const res = await fetch(JSON_PATH);
        
        // **CRÍTICO:** Si el servidor devuelve un 404 (res.ok es false),
        // no intenta parsear el HTML de error, previniendo el SyntaxError.
        if (!res.ok) {
            throw new Error(`Error al cargar el archivo. Ruta: ${JSON_PATH}. Código: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Asume que la estructura es { regiones: [...] }
        const dataArray: ComunaRegionData[] = data.regiones || []; 
        setRegionesData(dataArray);
        
      } catch (error) {
        console.error("Error cargando comunas-regiones:", error);
      } finally {
        setIsLoading(false);
      }
    }
    cargarRegiones();
  }, []); // Se ejecuta solo al montar el componente

  // --- FUNCIONES DE MANEJO DE ESTADO ---
  
  // Función para manejar el cambio de región (usando useCallback para estabilidad)
  const handleRegionChange = useCallback((region: string) => {
    setSelectedRegion(region);
    // Resetear comuna al cambiar región
    setSelectedComuna('');
  }, []);

  // Función para establecer la comuna (puede ser útil al precargar)
  const handleComunaChange = useCallback((comuna: string) => {
    setSelectedComuna(comuna);
  }, []);

  // --- DATA DERIVADA (CALCULADA CON useMemo) ---

  // 1. Opciones de regiones
  const regionesOptions: Option[] = useMemo(() => {
    return regionesData.map(r => ({ label: r.region, value: r.region }));
  }, [regionesData]); // Se recalcula solo cuando regionesData cambia (i.e., después de la carga inicial)

  // 2. Opciones de comunas (depende de la data cargada y la región seleccionada)
  const comunasOptions: Option[] = useMemo(() => {
    if (!selectedRegion || regionesData.length === 0) return [];

    const regionData = regionesData.find(r => r.region === selectedRegion);
    
    return regionData 
      ? regionData.comunas.map(c => ({ label: c, value: c }))
      : [];
  }, [selectedRegion, regionesData]); // Se recalcula si la región o la data cambian

  // 3. Efecto para manejar la inicialización de la comuna después de que la data cargue
  useEffect(() => {
    // Si la data ya está cargada y tenemos valores iniciales
    if (!isLoading && regionesData.length > 0 && initialRegion) {
        // Aseguramos que la región y comuna iniciales sigan siendo válidas
        const regionFound = regionesData.find(r => r.region === initialRegion);
        if (regionFound) {
            setSelectedRegion(initialRegion);
            // Solo establecemos la comuna inicial si existe en la lista de comunas de la región
            if (initialComuna && regionFound.comunas.includes(initialComuna)) {
                setSelectedComuna(initialComuna);
            }
        }
    }
  }, [isLoading, regionesData, initialRegion, initialComuna]);


  return {
    isLoading,
    regionesOptions, // Lista de { value, label } para el select de regiones
    comunasOptions,  // Lista de { value, label } para el select de comunas
    selectedRegion,
    selectedComuna,
    handleRegionChange, 
    handleComunaChange, 
  };
}

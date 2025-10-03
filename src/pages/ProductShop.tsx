// src/pages/ProductShop.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductoCard from '../components/ProductCard';
import type { Producto } from '../types/Product';

// Importa la base de datos de productos (asumiendo que está en data/)
import productosDB from '../data/productos.json';

// Importa el tipo de usuario (para una mejor tipificación)
import type { UsuarioDB } from '../types/User'; 

// Función para obtener la lista base de productos
const getProductosBase = (): Producto[] => productosDB as Producto[];

// Función auxiliar para obtener el usuario (se usará temporalmente para el estado inicial de filtros)
const getUsuarioDB = (): UsuarioDB | null => {
    const usuarioJSON = localStorage.getItem("usuarios");
    const usuarios: UsuarioDB[] = usuarioJSON ? JSON.parse(usuarioJSON) : [];
    // Nota: Esto es solo un ejemplo. En una app real, usarías el usuario logueado.
    return usuarios.find(u => localStorage.getItem("usuarioActual")?.includes(u.username)) || null;
};

// --- COMPONENTE PRINCIPAL DE LA TIENDA ---

const ProductShop: React.FC = () => {
    const location = useLocation();
    
    // Obtiene todos los productos de la DB y calcula el precio máximo una sola vez
    const todosLosProductos: Producto[] = useMemo(getProductosBase, []);
    const precioMaximoGlobal = useMemo(() => {
        if (todosLosProductos.length === 0) return 100000;
        return Math.max(...todosLosProductos.map(p => p.precio));
    }, [todosLosProductos]);

    // 🚨 SOLUCIÓN AL ERROR: Extraemos el parámetro de URL aquí, 
    // dándole alcance a todo el componente.
    const urlParams = new URLSearchParams(location.search);
    const categoriaParam = urlParams.get('categoria'); 
    
    // --- 1. ESTADO DE FILTROS ---
    const [productos, setProductos] = useState<Producto[]>([]); // Lista de productos a mostrar
    const [precioMaximoSlider, setPrecioMaximoSlider] = useState(precioMaximoGlobal);
    const [fabricantesSeleccionados, setFabricantesSeleccionados] = useState<string[]>([]);
    const [distribuidoresSeleccionados, setDistribuidoresSeleccionados] = useState<string[]>([]);
    const [criterioOrden, setCriterioOrden] = useState<string>("categoria");

    // --- 2. GENERACIÓN DE DATOS ÚNICOS PARA FILTROS ---
    const datosUnicos = useMemo(() => {
        const fabricantes = Array.from(new Set(todosLosProductos.map(p => p.fabricante).filter(Boolean)));
        const distribuidores = Array.from(new Set(todosLosProductos.map(p => p.distribuidor).filter(Boolean)));
        return { fabricantes, distribuidores };
    }, [todosLosProductos]);
    
    // --- 3. LÓGICA CENTRAL DE FILTRADO Y ORDENAMIENTO (Ahora usa categoriaParam del scope superior) ---
    useEffect(() => {
        let productosFiltradosTemp = [...todosLosProductos];

        // 1. FILTRADO POR URL (Usamos el valor obtenido arriba)
        if (categoriaParam) {
            productosFiltradosTemp = productosFiltradosTemp.filter(p => p.categoria === categoriaParam);
        }

        // 2. FILTRADO POR PRECIO
        productosFiltradosTemp = productosFiltradosTemp.filter(p => p.precio <= precioMaximoSlider);

        // 3. FILTRADO POR FABRICANTE
        if (fabricantesSeleccionados.length > 0) {
            productosFiltradosTemp = productosFiltradosTemp.filter(p => fabricantesSeleccionados.includes(p.fabricante));
        }
        
        // 4. FILTRADO POR DISTRIBUIDOR
        if (distribuidoresSeleccionados.length > 0) {
            productosFiltradosTemp = productosFiltradosTemp.filter(p => distribuidoresSeleccionados.includes(p.distribuidor));
        }

        // 5. ORDENAMIENTO (Reemplaza la lógica de ordenamiento de tu función)
        const ordenar = (a: Producto, b: Producto) => {
            if (criterioOrden === "precio-asc") return a.precio - b.precio;
            if (criterioOrden === "precio-desc") return b.precio - a.precio;
            if (criterioOrden === "nombre-asc") return a.nombre.localeCompare(b.nombre);
            if (criterioOrden === "nombre-desc") return b.nombre.localeCompare(a.nombre);
            // El orden 'mas-vendidos' o 'categoria' se simula aleatoriamente por simplicidad
            if (criterioOrden === "mas-vendidos") return Math.random() - 0.5;
            return 0; // Por defecto
        };
        productosFiltradosTemp.sort(ordenar);

        // 6. ACTUALIZAR EL ESTADO
        setProductos(productosFiltradosTemp);
        
    }, [
        todosLosProductos, 
        location.search, // Sigue siendo necesario para que el useEffect se dispare si el usuario cambia la categoría en la URL
        precioMaximoSlider, 
        fabricantesSeleccionados, 
        distribuidoresSeleccionados, 
        criterioOrden
    ]);
    
    // --- 4. HANDLERS DE EVENTOS ---
    
    // ... (Handlers de eventos se mantienen igual) ...

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrecioMaximoSlider(parseInt(e.target.value));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'fabricante' | 'distribuidor') => {
        const value = e.target.value;
        const checked = e.target.checked;
        
        const setter = tipo === 'fabricante' ? setFabricantesSeleccionados : setDistribuidoresSeleccionados;
        const currentList = tipo === 'fabricante' ? fabricantesSeleccionados : distribuidoresSeleccionados;
        
        if (checked) {
            setter([...currentList, value]);
        } else {
            setter(currentList.filter(item => item !== value));
        }
    };

    const handleLimpiarFiltros = () => {
        setFabricantesSeleccionados([]);
        setDistribuidoresSeleccionados([]);
        setPrecioMaximoSlider(precioMaximoGlobal);
        setCriterioOrden("categoria");
    };

    // Función para formatear las categorías (replicada del Header)
    const formatearCategoria = (categoria: string): string => {
        const sinGuiones = categoria.replace(/_/g, ' ');
        return sinGuiones.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // --- RENDERIZADO DEL COMPONENTE ---

    return (
        <div className="container py-5" data-bs-theme="dark">
            {/* 🚨 Línea 138 CORREGIDA: categoriaParam ahora está accesible */}
            <h1 className="text-light mb-4">Tienda de Productos {categoriaParam ? `(${formatearCategoria(categoriaParam)})` : ''}</h1>
            
            <div className="row">
                
                {/* 1. SIDEBAR DE FILTROS */}
                <div className="col-md-3 mb-4">
                    <aside className="sidebar-filters p-3 border rounded border-secondary bg-dark text-light">
                        {/* ... (Contenido de filtros) ... */}
                        <h4 className="mb-3">Filtros</h4>
                        
                        {/* Filtro de Precio */}
                        <div className="mb-4">
                            <h5 className="mb-2">Precio Máximo</h5>
                            <input 
                                type="range" 
                                className="form-range" 
                                min="0" 
                                max={precioMaximoGlobal} 
                                step="1000" 
                                id="precioRange"
                                value={precioMaximoSlider}
                                onChange={handleSliderChange}
                            />
                            <div className="d-flex justify-content-between">
                                <span>$0</span>
                                <span>${precioMaximoSlider.toLocaleString('es-ES')}</span>
                            </div>
                        </div>

                        {/* Filtro por Fabricante */}
                        <div className="mb-4">
                            <h5 className="mb-2">Fabricante</h5>
                            {datosUnicos.fabricantes.map(f => (
                                <div className="form-check" key={f}>
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        value={f} 
                                        id={`fabricante-${f}`}
                                        checked={fabricantesSeleccionados.includes(f)}
                                        onChange={(e) => handleCheckboxChange(e, 'fabricante')}
                                    />
                                    <label className="form-check-label" htmlFor={`fabricante-${f}`}>{f}</label>
                                </div>
                            ))}
                        </div>

                        {/* Filtro por Distribuidor */}
                        <div className="mb-4">
                            <h5 className="mb-2">Distribuidor</h5>
                            {datosUnicos.distribuidores.map(d => (
                                <div className="form-check" key={d}>
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        value={d} 
                                        id={`distribuidor-${d}`}
                                        checked={distribuidoresSeleccionados.includes(d)}
                                        onChange={(e) => handleCheckboxChange(e, 'distribuidor')}
                                    />
                                    <label className="form-check-label" htmlFor={`distribuidor-${d}`}>{d}</label>
                                </div>
                            ))}
                        </div>
                        
                        <div className="d-grid gap-2">
                            <button className="btn btn-outline-secondary" type="button" onClick={handleLimpiarFiltros}>Limpiar filtros</button>
                        </div>
                    </aside>
                </div>

                {/* 2. ÁREA DE PRODUCTOS Y ORDENAMIENTO */}
                <div className="col-md-9">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="m-0 text-white" id="contador-resultados">
                            {productos.length} resultados
                        </h5>
                        
                        {/* Dropdown de Ordenamiento */}
                        <div className="dropdown">
                            <button 
                                className="btn btn-secondary dropdown-toggle" 
                                type="button" 
                                id="dropdownOrdenar"
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                Ordenar por: {formatearCategoria(criterioOrden)}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownOrdenar">
                                {[
                                    { key: "categoria", label: "Categoría" }, 
                                    { key: "mas-vendidos", label: "Más vendidos" }, 
                                    { key: "precio-asc", label: "Precio: menor a mayor" },
                                    { key: "precio-desc", label: "Precio: mayor a menor" },
                                    { key: "nombre-asc", label: "Nombre: A-Z" },
                                    { key: "nombre-desc", label: "Nombre: Z-A" }
                                ].map(opcion => (
                                    <li key={opcion.key}>
                                        <a 
                                            className={`dropdown-item ${criterioOrden === opcion.key ? 'active' : ''}`} 
                                            href="#" 
                                            onClick={(e) => { e.preventDefault(); setCriterioOrden(opcion.key); }}
                                        >
                                            {opcion.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Contenedor de las Tarjetas de Producto */}
                    <div className="row" id="contenedor-productos">
                        {productos.length > 0 ? (
                            productos.map(producto => (
                                <ProductoCard key={producto.codigo} producto={producto} />
                            ))
                        ) : (
                            <p className="text-center text-muted mt-5">No se encontraron productos con los filtros seleccionados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductShop;
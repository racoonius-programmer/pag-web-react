// src/pages/ProductShop.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductoCard from '../components/ProductCard';
import type { Product } from '../types/Product';

// Importa la base de datos de productos (asumiendo que está en data/)
import productosDB from '../data/productos.json';

// Importa el tipo de usuario (para una mejor tipificación)
import type { Usuario } from '../types/User';

// Función para obtener la lista base de productos
const getProductosBase = (): Product[] => productosDB as Product[];

// ✅ CÓDIGO ARREGLADO: Función auxiliar para obtener el usuario
const getUsuarioDB = (): Usuario | null => {
    const usuariosJSON = localStorage.getItem("usuarios");
    const usuarios: Usuario[] = usuariosJSON ? JSON.parse(usuariosJSON) : [];

    const usuarioActualRaw = localStorage.getItem("usuarioActual");
    if (!usuarioActualRaw) return null;

    // usuarioActual puede ser "username" o un JSON stringificado del objeto usuario.
    let usernameActual: string | null = null;
    try {
      const parsed = JSON.parse(usuarioActualRaw);
      if (parsed && typeof parsed === 'object' && parsed.username) usernameActual = parsed.username;
      else if (typeof parsed === 'string') usernameActual = parsed;
    } catch {
      // no es JSON, tratar como username plano
      usernameActual = usuarioActualRaw;
    }

    if (!usernameActual) return null;
    return usuarios.find(u => u.username === usernameActual) || null;
};

// ----------------------------------------------------------------------
// --- COMPONENTE PRINCIPAL DE LA TIENDA ---
// ----------------------------------------------------------------------

const ProductShop: React.FC = () => {
    const location = useLocation();

    // Obtiene todos los productos de la DB y calcula el precio máximo una sola vez
    const todosLosProductos: Product[] = useMemo(getProductosBase, []);
    const precioMaximoGlobal = useMemo(() => {
        if (todosLosProductos.length === 0) return 100000;
        return Math.max(...todosLosProductos.map(p => p.precio));
    }, [todosLosProductos]);

    // Extraemos el parámetro de URL
    const urlParams = new URLSearchParams(location.search);
    const categoriaParam = urlParams.get('categoria');

    // --- 1. ESTADO DE FILTROS ---
    const [productos, setProductos] = useState<Product[]>([]); // Lista de productos a mostrar
    const [precioMaximoSlider, setPrecioMaximoSlider] = useState(precioMaximoGlobal);
    const [fabricantesSeleccionados, setFabricantesSeleccionados] = useState<string[]>([]);
    const [distribuidoresSeleccionados, setDistribuidoresSeleccionados] = useState<string[]>([]);
    const [criterioOrden, setCriterioOrden] = useState<string>("categoria");

    // --- 2. GENERACIÓN DE DATOS ÚNICOS PARA FILTROS ---
    const datosUnicos = useMemo(() => {
        // Uso de type assertion para ayudar a TypeScript, asumiendo que fabricante/distribuidor son string si existen
        const fabricantes: string[] = Array.from(new Set(todosLosProductos.map(p => p.fabricante).filter(Boolean))) as string[];
        const distribuidores: string[] = Array.from(new Set(todosLosProductos.map(p => p.distribuidor).filter(Boolean))) as string[];
        return { fabricantes, distribuidores };
    }, [todosLosProductos]);

    // --- 3. LÓGICA CENTRAL DE FILTRADO Y ORDENAMIENTO ---
    useEffect(() => {
        let productosFiltradosTemp = [...todosLosProductos];

        // 1. FILTRADO POR URL
        if (categoriaParam) {
            productosFiltradosTemp = productosFiltradosTemp.filter(p => p.categoria === categoriaParam);
        }

        // 2. FILTRADO POR PRECIO
        productosFiltradosTemp = productosFiltradosTemp.filter(p => p.precio <= precioMaximoSlider);

        // 3. FILTRADO POR FABRICANTE
        if (fabricantesSeleccionados.length > 0) {
            // Se añade una comprobación para null/undefined por seguridad
            productosFiltradosTemp = productosFiltradosTemp.filter(p => fabricantesSeleccionados.includes(p.fabricante || ''));
        }

        // 4. FILTRADO POR DISTRIBUIDOR
        if (distribuidoresSeleccionados.length > 0) {
            // Se añade una comprobación para null/undefined por seguridad
            productosFiltradosTemp = productosFiltradosTemp.filter(p => distribuidoresSeleccionados.includes(p.distribuidor || ''));
        }

        // 5. ORDENAMIENTO
        const ordenar = (a: Product, b: Product) => {
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
        location.search,
        precioMaximoSlider,
        fabricantesSeleccionados,
        distribuidoresSeleccionados,
        criterioOrden
    ]);

    // --- 4. HANDLERS DE EVENTOS ---

    // ✅ CÓDIGO ARREGLADO: Se añade el radix 10 a parseInt
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrecioMaximoSlider(parseInt(e.target.value, 10));
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

    const usuarioLogueado = getUsuarioDB();
    const esDuoc = !!(usuarioLogueado && usuarioLogueado.descuentoDuoc === true);

    return (
        <div className="container py-5" data-bs-theme="dark">
            <h1 className="text-light mb-4">Tienda de Productos {categoriaParam ? `(${formatearCategoria(categoriaParam)})` : ''}</h1>
            <div className="row gx-2 gy-3">
                {/* SIDEBAR: ocupar 3 cols en md y lg */}
                <div className="col-12 col-md-3 col-lg-3 d-flex flex-column align-items-stretch mb-4">
                    <aside className="sidebar-filters p-3 border rounded border-secondary bg-dark text-light">
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

                {/* AREA DE PRODUCTOS */}
                <div className="col-12 col-md-9 col-lg-9">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                        <h5 className="m-0 text-white" id="contador-resultados">
                            {productos.length} resultados
                        </h5>
                        {/* Dropdown de Ordenamiento */}
                        <div className="dropdown" style={{ minWidth: '260px', maxWidth: '320px' }}>
                            <button
                                className="btn btn-primary dropdown-toggle w-100"
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
                    <div className="row gx-3 gy-4" id="contenedor-productos">
                        {productos.length > 0 ? (
                            productos.map(producto => (
                                <div className="col-12 col-sm-6 col-md-4 mb-4 d-flex align-items-stretch" key={producto.codigo}>
                                    <ProductoCard producto={producto} esDuoc={esDuoc} />
                                </div>
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
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductoCard from '../components/ProductCard';
import type { Product } from '../types/Product';
import { useProducts } from '../hooks/UseProducts';
import { useUsuarioActual } from '../hooks/UseUsuarioActual';

/*
    ProductShop (documentación rápida - TOP)
    -------------------------------------------------
    Ideas generales y propósito:
    - Esta página es la vista principal de la tienda. Lista productos y permite
        aplicar filtros (categoría, búsqueda, precio, fabricante, distribuidor)
        y ordenar los resultados.
    - Consume `useProducts()` (hook personalizado) como fuente de datos.
    - Usa `useUsuarioActual()` para obtener información del usuario logueado.
    - Mantiene estados locales para controles de UI (slider de precio, checkboxes,
        criterio de orden, término de búsqueda) y recalcula la lista mostrada cada vez
        que cambian los insumos (productos, parámetros URL o filtros).
    - Está pensada para ser una capa de presentación + filtrado; la fuente de
        verdad de los datos está en el hook `useProducts` / `productos.json`.

    Resumen rápido:
    1. Lee `useProducts()` para entender de dónde vienen los productos.
    2. Revisa los estados declarados abajo (precio, fabricantes, distribuidores...)
         para ver cómo afectan el filtrado.
    3. Mira el `useEffect` central que aplica los filtros y ordena `productos`.
    4. El render muestra un sidebar con filtros y un grid de `ProductoCard`.
*/

const ProductShop: React.FC = () => {
    const location = useLocation();
    const { productos: todosLosProductos } = useProducts();
    const { usuario: usuarioLogueado, loading: loadingUsuario, esDuoc } = useUsuarioActual();

    // Calcular el precio máximo usando los productos del hook
    const precioMaximoGlobal = useMemo(() => {
        if (todosLosProductos.length === 0) return 0;
        return Math.max(...todosLosProductos.map(p => p.precio));
    }, [todosLosProductos]);

    // Extraemos los parámetros de URL
    const urlParams = new URLSearchParams(location.search);
    const categoriaParam = urlParams.get('categoria');
    const searchParam = urlParams.get('search');

    // --- 1. ESTADO DE FILTROS ---
    const [productos, setProductos] = useState<Product[]>([]); // Lista de productos a mostrar
    const [precioMaximoSlider, setPrecioMaximoSlider] = useState(precioMaximoGlobal);
    const [fabricantesSeleccionados, setFabricantesSeleccionados] = useState<string[]>([]);
    const [distribuidoresSeleccionados, setDistribuidoresSeleccionados] = useState<string[]>([]);
    const [criterioOrden, setCriterioOrden] = useState<string>("categoria");
    const [terminoBusqueda, setTerminoBusqueda] = useState<string>(searchParam || '');

    // Actualizar precio máximo cuando cambian los productos
    useEffect(() => {
        setPrecioMaximoSlider(precioMaximoGlobal);
    }, [precioMaximoGlobal]);

    // Actualizar término de búsqueda cuando cambia la URL
    useEffect(() => {
        setTerminoBusqueda(searchParam || '');
    }, [searchParam]);

    // --- 2. GENERACIÓN DE DATOS ÚNICOS PARA FILTROS ---
    const datosUnicos = useMemo(() => {
        // Primero filtrar por categoría si existe el parámetro
        let productosParaFiltros = [...todosLosProductos];
        if (categoriaParam) {
            productosParaFiltros = productosParaFiltros.filter(p => p.categoria === categoriaParam);
        }
        
        // Luego generar los datos únicos solo de los productos filtrados por categoría
        const fabricantes: string[] = Array.from(new Set(productosParaFiltros.map(p => p.fabricante).filter(Boolean))) as string[];
        const distribuidores: string[] = Array.from(new Set(productosParaFiltros.map(p => p.distribuidor).filter(Boolean))) as string[];
        return { fabricantes, distribuidores };
    }, [todosLosProductos, categoriaParam]);

    // --- 3. LÓGICA CENTRAL DE FILTRADO Y ORDENAMIENTO ---
    useEffect(() => {
        let productosFiltradosTemp = [...todosLosProductos];

        // 1. FILTRADO POR URL (CATEGORÍA)
        if (categoriaParam) {
            productosFiltradosTemp = productosFiltradosTemp.filter(p => p.categoria === categoriaParam);
        }

        // 2. FILTRADO POR BÚSQUEDA
        if (terminoBusqueda.trim()) {
            const termino = terminoBusqueda.toLowerCase();
            productosFiltradosTemp = productosFiltradosTemp.filter(p => {
                return (
                    p.nombre.toLowerCase().includes(termino) ||
                    p.codigo.toLowerCase().includes(termino) ||
                    (p.fabricante && p.fabricante.toLowerCase().includes(termino)) ||
                    (p.Descripcion && p.Descripcion.toLowerCase().includes(termino))
                );
            });
        }

        // 3. FILTRADO POR PRECIO
        productosFiltradosTemp = productosFiltradosTemp.filter(p => p.precio <= precioMaximoSlider);

        // 4. FILTRADO POR FABRICANTE
        if (fabricantesSeleccionados.length > 0) {
            productosFiltradosTemp = productosFiltradosTemp.filter(p => fabricantesSeleccionados.includes(p.fabricante || ''));
        }

        // 5. FILTRADO POR DISTRIBUIDOR
        if (distribuidoresSeleccionados.length > 0) {
            productosFiltradosTemp = productosFiltradosTemp.filter(p => distribuidoresSeleccionados.includes(p.distribuidor || ''));
        }

        // 6. ORDENAMIENTO
        const ordenar = (a: Product, b: Product) => {
            if (criterioOrden === "precio-asc") return a.precio - b.precio;
            if (criterioOrden === "precio-desc") return b.precio - a.precio;
            if (criterioOrden === "nombre-asc") return a.nombre.localeCompare(b.nombre);
            if (criterioOrden === "nombre-desc") return b.nombre.localeCompare(a.nombre);
            if (criterioOrden === "mas-vendidos") return Math.random() - 0.5;
            return 0;
        };
        productosFiltradosTemp.sort(ordenar);

        // 7. ACTUALIZAR EL ESTADO
        setProductos(productosFiltradosTemp);

    }, [
        todosLosProductos,
        location.search,
        precioMaximoSlider,
        fabricantesSeleccionados,
        distribuidoresSeleccionados,
        criterioOrden,
        terminoBusqueda
    ]);

    // --- 4. HANDLERS DE EVENTOS ---

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
        setTerminoBusqueda('');
    };

    // Función para formatear las categorías (replicada del Header)
    const formatearCategoria = (categoria: string): string => {
        const sinGuiones = categoria.replace(/_/g, ' ');
        return sinGuiones.toLowerCase().split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // --- RENDERIZADO DEL COMPONENTE ---

    // Mostrar loading mientras se cargan los datos del usuario
    if (loadingUsuario) {
        return (
            <div className="container py-5" data-bs-theme="dark">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" data-bs-theme="dark">
            <h1 className="text-light mb-4">
                Tienda de Productos {categoriaParam ? `(${formatearCategoria(categoriaParam)})` : ''}
            </h1>
            <div className="row gx-2 gy-3">
                {/* SIDEBAR: ocupar 3 cols en md y lg */}
                <div className="col-12 col-md-3 col-lg-3 d-flex flex-column align-items-stretch mb-4">
                    <aside className="sidebar-filters p-3 border rounded border-secondary bg-dark text-light">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="m-0">Filtros</h4>
                            <button className="btn btn-sm btn-outline-secondary" type="button" onClick={handleLimpiarFiltros}>
                                Limpiar filtros
                            </button>
                        </div>

                        {/* Mostrar término de búsqueda activo */}
                        {terminoBusqueda && (
                            <div className="alert alert-info py-2 px-3 mb-3" role="alert">
                                <small>
                                    <i className="bi bi-search me-1"></i>
                                    Buscando: <strong>{terminoBusqueda}</strong>
                                </small>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white btn-sm float-end" 
                                    style={{ fontSize: '0.7rem' }}
                                    onClick={() => setTerminoBusqueda('')}
                                    aria-label="Limpiar búsqueda"
                                ></button>
                            </div>
                        )}

                        {/* Filtro de Precio */}
                        <div className="mb-4">
                            <h5 className="mb-2">Precio Máximo</h5>
                            <input
                                type="range"
                                className="form-range"
                                min="0"
                                max={precioMaximoGlobal}
                                step="10"
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
                    </aside>
                </div>

                {/* AREA DE PRODUCTOS */}
                <div className="col-12 col-md-9 col-lg-9">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                        <h5 className="m-0 text-white" id="contador-resultados">
                            {productos.length} resultado{productos.length !== 1 ? 's' : ''}
                            {terminoBusqueda && <span className="text-muted ms-2">para "{terminoBusqueda}"</span>}
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
                            <div className="text-center text-light py-5">
                                <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                <p>
                                    {terminoBusqueda 
                                        ? `No se encontraron productos para "${terminoBusqueda}".` 
                                        : 'No se encontraron productos con los filtros seleccionados.'}
                                </p>
                                <button className="btn btn-outline-light" onClick={handleLimpiarFiltros}>
                                    Limpiar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductShop;

/*
    Archivos que importan / usan `ProductShop` (y por qué):
    - `src/App.tsx`:
            - Monta `ProductShop` en la ruta `/productos`. Es la entrada principal a la
                vista de tienda donde los usuarios navegan y filtran productos.

    - `src/components/Header.tsx`:
            - Contiene enlaces/menús que llevan a `/productos` o a categorías específicas
                (ej. "Ver Todo"), permitiendo al usuario acceder rápidamente a la tienda.

    - `src/components/BannerBienvenida.tsx`:
            - Incluye un CTA "Ver productos" que navega a `/productos` y sirve como
                acceso directo desde la home.

    - `src/components/ProductCard.tsx`:
            - No "importa" ProductShop pero sí es consumido por él: `ProductShop` renderiza
                `ProductoCard` para cada producto. Si modificas la API de props de
                `ProductoCard`, actualiza este archivo.

*/
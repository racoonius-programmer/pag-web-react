import React, { useMemo } from 'react';
import ProductoCard from './ProductCard';
import type { Product } from '../types/Product';
// Tipo Usuario (se usa para decidir si aplica descuento DUOC al usuario actual)
import type { Usuario } from '../types/User'; 

// JSON local que actúa como DB de productos (src/data/productos.json)
import productosDB from '../data/productos.json';

// Función auxiliar para obtener el usuario actual desde localStorage.
// - Lee `usuarios` (array) y `usuarioActual` (string o JSON stringificado).
// - Devuelve el objeto Usuario correspondiente o null si no hay ninguno.
const getUsuarioDB = (): Usuario | null => {
    const usuariosJSON = localStorage.getItem("usuarios");
    const usuarios: Usuario[] = usuariosJSON ? JSON.parse(usuariosJSON) : [];

    const usuarioActualRaw = localStorage.getItem("usuarioActual");
    if (!usuarioActualRaw) return null;

        // `usuarioActual` puede ser un username (string) o un objeto stringificado.
        // Intentamos parsearlo: si es un objeto con `username` lo usamos; si parsea a string también lo aceptamos.
        let usernameActual: string | null = null;
        try {
            const parsed = JSON.parse(usuarioActualRaw);
            if (parsed && typeof parsed === 'object' && parsed.username) usernameActual = parsed.username;
            else if (typeof parsed === 'string') usernameActual = parsed;
        } catch {
            // Si no es JSON parseable, tratamos `usuarioActualRaw` como username plano.
            usernameActual = usuarioActualRaw;
        }

    if (!usernameActual) return null;
    return usuarios.find(u => u.username === usernameActual) || null;
};


/*
    ProductosDestacados
    - Propósito: mostrar la sección "Lo más vendido" con hasta 3 productos seleccionados aleatoriamente.
    - Uso: componente sin props; importarlo en una página y renderizar <ProductosDestacados />.
    - Comportamiento: decide si el usuario tiene `descuentoDuoc` leyendo localStorage y pasa
        esa información a `ProductoCard` vía la prop `esDuoc`.
*/

const ProductosDestacados: React.FC = () => {
    
    // Obtener usuario actual (memoizado para no leer localStorage en cada render)
    const usuarioLogueado = useMemo(getUsuarioDB, []);
    // Determina si aplica descuento DUOC al usuario (booleano)
    const esDuoc = !!(usuarioLogueado && usuarioLogueado.descuentoDuoc === true);
    
    // Selección de 3 productos al azar (se hace una vez al montar)
    const productosSeleccionados = useMemo(() => {
        const productos: Product[] = productosDB as Product[];

        // Si la lista está vacía, no hagas nada
        if (productos.length === 0) {
            return [];
        }
        
        // Selección: clona, mezcla aleatoriamente y toma los primeros 3
        const seleccion = productos
            .slice()
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        return seleccion;
    }, []); // Se ejecuta una sola vez al montar el componente

    return (
        <div data-bs-theme="dark">
            <br />
            <h1 style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '10px' }} className="text-light">
                Lo más vendido
            </h1>
            <div className="container py-5">
                {productosSeleccionados.length > 0 ? (
                    <div className="d-flex flex-row justify-content-center overflow-auto gap-4 px-2" id="mas-vendidos" style={{scrollSnapType:'x mandatory'}}>
                        {productosSeleccionados.map(producto => (
                            <div style={{ minWidth: '320px', scrollSnapAlign:'start', margin: '0 auto' }} key={producto.codigo}>
                                {/* Pasar la prop 'esDuoc' al ProductoCard para que aplique el descuento si aplica */}
                                <ProductoCard producto={producto} esDuoc={esDuoc} /> 
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-center text-muted'>No hay productos disponibles para mostrar.</p>
                )}
            </div>
        </div>
    );
};

export default ProductosDestacados;

/*
    Llamadas a este componente:
    - `src/pages/Inicio.tsx` importa y renderiza `<ProductosDestacados />`.
*/
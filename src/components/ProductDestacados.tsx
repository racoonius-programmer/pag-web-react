import React, { useMemo } from 'react';
import ProductoCard from './ProductCard';
import type { Product } from '../types/Product';
import { useProducts } from '../hooks/UseProducts';
import { useUsuarioActual } from '../hooks/UseUsuarioActual';

/*
    ProductosDestacados
    - Propósito: mostrar la sección "Lo más vendido" con hasta 3 productos seleccionados aleatoriamente.
    - Uso: componente sin props; importarlo en una página y renderizar <ProductosDestacados />.
    - Comportamiento: decide si el usuario tiene `descuentoDuoc` consultando la API y pasa
        esa información a `ProductoCard` vía la prop `esDuoc`.
*/

const ProductosDestacados: React.FC = () => {
    const { productos: todosLosProductos } = useProducts();
    const { loading: loadingUsuario, esDuoc } = useUsuarioActual();
    
    // Selección de 3 productos al azar (se hace una vez cuando cambian los productos)
    const productosSeleccionados = useMemo(() => {
        // Si la lista está vacía, no hagas nada
        if (todosLosProductos.length === 0) {
            return [];
        }
        
        // Selección: clona, mezcla aleatoriamente y toma los primeros 3
        const seleccion = todosLosProductos
            .slice()
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        return seleccion;
    }, [todosLosProductos]); // Se ejecuta cuando cambian los productos

    // Mostrar loading mientras se cargan los datos del usuario
    if (loadingUsuario) {
        return (
            <div data-bs-theme="dark">
                <br />
                <h1 style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '10px' }} className="text-light">
                    Lo más vendido
                </h1>
                <div className="container py-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
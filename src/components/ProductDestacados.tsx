// src/components/ProductosDestacados.tsx
import React, { useMemo } from 'react';
import ProductoCard from './ProductCard';
import type { Producto } from '../types/Product';

// Importa la base de datos de productos (asumiendo que está en data/)
import productosDB from '../data/productos.json';

const ProductosDestacados: React.FC = () => {

    // 1. Lógica para seleccionar 3 productos al azar (Migrada desde Vanilla JS)
    const productosSeleccionados = useMemo(() => {
        const productos: Producto[] = productosDB as Producto[];

        // Si la lista está vacía, no hagas nada
        if (productos.length === 0) {
            return [];
        }
        
        // Simulación: toma 3 al azar
        const seleccion = productos
            // 1. Clona el array para no modificar el original
            .slice() 
            // 2. Ordena aleatoriamente
            .sort(() => 0.5 - Math.random())
            // 3. Toma los primeros 3
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
                    // Mapea los productos seleccionados y renderiza el componente Card
                    <div className="row justify-content-center" id="mas-vendidos">
                        {productosSeleccionados.map(producto => (
                            <ProductoCard key={producto.codigo} producto={producto} />
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
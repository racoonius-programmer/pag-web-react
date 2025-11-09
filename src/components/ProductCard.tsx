import React from 'react';
// useNavigate: hook de react-router para navegar programáticamente a rutas (detalle, carrito, etc.)
import { useNavigate } from 'react-router-dom';
// Tipo Product definido en src/types/Product.ts — describe la forma de los productos
import type { Product } from '../types/Product';
// Hook personalizado para calcular descuentos según reglas del producto
import { usarDescuento } from '../hooks/Descuentos';
// Contexto del carrito (añadir items, contar, etc.)
import { useCartContext } from '../hooks/UseCart';

// Props que recibe la tarjeta de producto
interface ProductoCardProps {
    // `producto`: objeto con datos (nombre, precio, imagen, código...)
    producto: Product;
    // `esDuoc`: override opcional para forzar el descuento DUOC (booleano)
    esDuoc?: boolean;                
    // `imageHeight`: permite controlar la altura de la imagen (número->px o string con unidad)
    imageHeight?: number | string;
    // `fixed`: si true aplica clase para anchura/alto fijo (estilizado CSS)
    fixed?: boolean;
}



const ProductoCard: React.FC<ProductoCardProps> = ({ producto, esDuoc, imageHeight, fixed = false }) => {
    // Obtener datos del hook de descuento: decide precioFinal y si tiene descuento
    const descuentoHook = usarDescuento(producto);
    const precioOriginal = producto.precio || 0;

    // Lógica de precio:
    // - Si pasó `esDuoc` (true/false) aplicamos el descuento DUOC (80% del precio si true)
    // - Si no, usamos el resultado calculado por `usarDescuento` (hook)
    const precioFinal = typeof esDuoc !== 'undefined'
        ? (esDuoc ? Math.round(precioOriginal * 0.8) : precioOriginal)
        : descuentoHook.precioFinal;

    // Determina si mostramos etiqueta de descuento
    const tieneDescuento = typeof esDuoc !== 'undefined' ? esDuoc : descuentoHook.tieneDescuento;

    // Contexto del carrito para añadir items
    const { addToCart } = useCartContext();
    // Hook de navegación para ir a páginas (detalle, carrito)
    const navigate = useNavigate();
    const detailPath = `/productos/${producto.codigo}`;

    // Handler: al hacer click en "Añadir al carrito" añadimos 1 unidad y navegamos al carrito
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Crear una copia del producto con el precio final (con descuento si aplica)
        const productoConPrecioFinal = {
            ...producto,
            precio: precioFinal // Usar el precio final calculado (con descuento DUOC si aplica)
        };
        
        addToCart(productoConPrecioFinal, 1);
        navigate('/carrito');
    };

    // Handler: ir a la página de detalle del producto (no prevenir default para permitir enlaces si los hubiera)
    const handleVerDetalle = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(detailPath);
    };

    // Construir objeto style con una variable CSS personalizada para controlar la altura de la imagen
    const cssVarStyle = {
        ['--product-image-height' as any]:
            imageHeight === undefined ? undefined : (typeof imageHeight === 'number' ? `${imageHeight}px` : imageHeight),
    } as React.CSSProperties;

    // Clases de la tarjeta, con opción `product-card-fixed` si `fixed` es true
    const clases = `card h-100 d-flex flex-column bg-dark text-light border-secondary${fixed ? ' product-card-fixed' : ''}`;

    return (
        <div className={clases} style={cssVarStyle}>
            <div className="product-image-wrapper">
                {/* Imagen del producto si existe */}
                {producto.imagen && <img src={producto.imagen} alt={producto.nombre} className="product-image" />}
            </div>

            <div className="card-body d-flex flex-column">
                {/* Nombre y descripción truncada */}
                <h5 className="card-title text-white">{producto.nombre}</h5>
                {producto.Descripcion && <p className="card-text text-secondary text-truncate">{producto.Descripcion}</p>}
                <p className="text-secondary mb-2">Código: {producto.codigo}</p>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                    {/* Botón para ver detalle */}
                    <button type="button" className="btn btn-outline-primary" onClick={handleVerDetalle}>
                    Detalles
                    </button>

                    {/* Precio final (formateado) y badge de descuento si aplica */}
                    <div className="fw-bold text-white px-3 py-2 precio-badge" style={{ backgroundColor: '#1E90FF', borderRadius: 6 }}>
                        ${precioFinal.toLocaleString('es-ES')}
                        {tieneDescuento && <small className="text-warning fw-normal ms-2">(-20%)</small>}
                    </div>
                </div>

                {/* Botón principal para añadir al carrito */}
                <button type="button" className="btn btn-success mt-3 w-100" onClick={handleAddToCart}>
                    <i className="bi bi-cart-plus me-2" /> Añadir al carrito
                </button>
            </div>
        </div>
    );
};

export default ProductoCard;

/*
    Este componente `ProductoCard` se usa en:
    - src/pages/ProductShop.tsx
    - src/components/ProductDestacados.tsx
*/
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { usarDescuento } from '../hooks/Descuentos';
import { useCartContext } from '../hooks/UseCart';

interface ProductoCardProps {
    producto: Product;
    esDuoc?: boolean;                 // <-- añade aquí la prop opcional
    imageHeight?: number | string;
    fixed?: boolean;
}



const ProductoCard: React.FC<ProductoCardProps> = ({ producto, esDuoc, imageHeight, fixed = false }) => {
    const descuentoHook = usarDescuento(producto);
    const precioOriginal = producto.precio || 0;
    const precioFinal = typeof esDuoc !== 'undefined'
        ? (esDuoc ? Math.round(precioOriginal * 0.8) : precioOriginal)
        : descuentoHook.precioFinal;
    const tieneDescuento = typeof esDuoc !== 'undefined' ? esDuoc : descuentoHook.tieneDescuento;

    const { addToCart } = useCartContext();
    const navigate = useNavigate();
    const detailPath = `/productos/${producto.codigo}`;

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

    const handleVerDetalle = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(detailPath);
    };

    const cssVarStyle = {
        ['--product-image-height' as any]:
            imageHeight === undefined ? undefined : (typeof imageHeight === 'number' ? `${imageHeight}px` : imageHeight),
    } as React.CSSProperties;

    const clases = `card h-100 d-flex flex-column bg-dark text-light border-secondary${fixed ? ' product-card-fixed' : ''}`;

    return (
        <div className={clases} style={cssVarStyle}>
            <div className="product-image-wrapper">
                {producto.imagen && <img src={producto.imagen} alt={producto.nombre} className="product-image" />}
            </div>

            <div className="card-body d-flex flex-column">
                <h5 className="card-title text-white">{producto.nombre}</h5>
                {producto.Descripcion && <p className="card-text text-secondary text-truncate">{producto.Descripcion}</p>}
                <p className="text-secondary mb-2">Código: {producto.codigo}</p>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <button type="button" className="btn btn-outline-primary" onClick={handleVerDetalle}>
                    Detalles
                    </button>

                    <div className="fw-bold text-white px-3 py-2 precio-badge" style={{ backgroundColor: '#1E90FF', borderRadius: 6 }}>
                        ${precioFinal.toLocaleString('es-ES')}
                        {tieneDescuento && <small className="text-warning fw-normal ms-2">(-20%)</small>}
                    </div>
                </div>

                <button type="button" className="btn btn-success mt-3 w-100" onClick={handleAddToCart}>
                    <i className="bi bi-cart-plus me-2" /> Añadir al carrito
                </button>
            </div>
        </div>
    );
};

export default ProductoCard;
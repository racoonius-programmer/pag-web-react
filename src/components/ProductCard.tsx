// src/components/ProductCard.tsx

import React from 'react';
// Importamos el tipo 'Product' desde la carpeta types
import type { Product } from '../types/Product'; 
// Importamos el hook que nos da acceso a la lógica del carrito
import { useCartContext } from '../hooks/UseCart'; 

interface ProductCardProps {
    product: Product; // El componente recibe un producto para mostrar
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // 1. Obtener la función 'addToCart' del contexto
    const { addToCart } = useCartContext();

    // 2. Manejador de evento para el botón
    const handleAddToCart = () => {
        // Llama a la función addToCart, añadiendo 1 unidad del producto actual.
        addToCart(product, 1);
        
        // Opcional: Proporciona feedback al usuario
        console.log(`Producto ${product.nombre} añadido al carrito.`);
        // Dependiendo de tu UI, puedes usar un Toast o un Modal aquí.
    };

    return (
        <div className="product-card card shadow-sm">
            {/* Detalles del Producto */}
            <img 
                src={product.imagen || 'placeholder.jpg'} // Usa una imagen placeholder si no hay
                className="card-img-top" 
                alt={product.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <div className="card-body">
                <h5 className="card-title">{product.nombre}</h5>
                <p className="card-text text-muted small">{product.Descripcion?.substring(0, 50)}...</p>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold fs-5 text-success">
                        ${product.precio.toLocaleString('es-ES')}
                    </span>
                    <span className="badge bg-info">{product.categoria}</span>
                </div>
                
                {/* 3. Botón para añadir al carrito */}
                <button 
                    className="btn btn-primary w-100"
                    onClick={handleAddToCart}
                >
                    <i className="bi bi-cart-plus me-2"></i> Añadir al Carrito
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
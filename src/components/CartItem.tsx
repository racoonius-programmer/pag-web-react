// src/components/CartItem.tsx

import React from 'react';
import type { CartItem } from '../types/Cart'; // Asegúrate de que el archivo se llama Cart.ts
import { useCartContext } from '../hooks/UseCart'; // Importación consistente

interface CartItemProps {
    item: CartItem;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
    const { addToCart, removeFromCart } = useCartContext();

    const subtotal = item.precio * item.cantidad;

    return (
        <div className="product-card d-flex align-items-center p-3 mb-3 bg-secondary text-white rounded">
            <img src={item.imagen} alt={item.nombre} className="product-image me-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            
            <div className="flex-grow-1">
                <h5 className="mb-1">{item.nombre}</h5>
                <p className="text-light mb-1 small">{item.Descripcion}</p>
            </div>
            
            <div className="d-flex flex-column align-items-center me-4">
                <span className="mb-2 fw-bold text-success">${item.precio.toLocaleString('es-ES')}</span>
                <div className="quantity-control d-flex align-items-center">
                    <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => removeFromCart(item.codigo)}
                    >
                        -
                    </button>
                    <input 
                        type="text" 
                        className="form-control form-control-sm text-center mx-1" 
                        value={item.cantidad} 
                        readOnly
                        style={{ width: '50px', userSelect: 'none' }}
                    />
                    <button 
                        className="btn btn-sm btn-outline-success" 
                        // Al hacer clic en '+', agregamos 1 unidad del producto (item)
                        onClick={() => addToCart(item, 1)} 
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="ms-4">
                <span className="fw-bold">Subtotal: ${subtotal.toLocaleString('es-ES')}</span>
            </div>
        </div>
    );
};

export default CartItemComponent;
// src/components/CartItem.tsx

import React from 'react';
// Tipo que describe la forma de un item en el carrito (codigo, nombre, precio, etc.)
import type { CartItem } from '../types/Cart'; 

// Hook de contexto del carrito que provee funciones para modificar el carrito
import { useCartContext } from '../hooks/UseCart';

// Props del componente: recibe un `item` que cumple la interfaz CartItem
interface CartItemProps {
    item: CartItem;
}

// Componente que renderiza una fila/item dentro del carrito de compra
const CartItemComponent: React.FC<CartItemProps> = ({ item }) => {
    // extraemos funciones del contexto del carrito para añadir/quitar unidades
    const { addToCart, removeFromCart } = useCartContext();

    // Calcula un subtotal local (precio * cantidad) para mostrarlo en la UI
    const subtotal = item.precio * item.cantidad;

    return (
        // Card que contiene imagen, información, controles de cantidad y subtotal
        <div className="product-card d-flex align-items-center p-3 mb-3 bg-secondary text-white rounded">
            {/* Imagen del producto: usa la ruta almacenada en `item.imagen` */}
            <img src={item.imagen} alt={item.nombre} className="product-image me-3" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            
            {/* Información básica: nombre y descripción */}
            <div className="flex-grow-1">
                <h5 className="mb-1">{item.nombre}</h5>
                <p className="text-light mb-1 small">{item.Descripcion}</p>
            </div>
            
            {/* Controles de precio y cantidad */}
            <div className="d-flex flex-column align-items-center me-4">
                {/* Precio unitario formateado para 'es-ES' */}
                <span className="mb-2 fw-bold text-success">${item.precio.toLocaleString('es-ES')}</span>
                <div className="quantity-control d-flex align-items-center">
                    {/* Botón de '-' : llama a removeFromCart pasando el código del producto*/}
                    <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => removeFromCart(item.codigo)}
                    >
                        -
                    </button>
                    {/* Mostrar cantidad actual*/}
                    <input 
                        type="text" 
                        className="form-control form-control-sm text-center mx-1" 
                        value={item.cantidad} 
                        readOnly
                        style={{ width: '50px', userSelect: 'none' }}
                    />
                    {/* Botón de '+': agrega 1 unidad más del mismo item al carrito */}
                    <button 
                        className="btn btn-sm btn-outline-success" 
                        onClick={() => addToCart(item, 1)} 
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Subtotal calculado mostrado al final */}
            <div className="ms-4">
                <span className="fw-bold">Subtotal: ${subtotal.toLocaleString('es-ES')}</span>
            </div>
        </div>
    );
};

// Export por defecto para usar el componente en la página de carrito
export default CartItemComponent;

/*
    Archivos que importan / usan este componente `CartItemComponent` (CartItem.tsx):

    - src/pages/ProductsCarrito.tsx
        Razón: página que muestra la lista completa de items en el carrito. Importa
                     `CartItemComponent` y lo mapea sobre el array `cart: CartItem[]` para
                     renderizar cada fila del carrito.

    - src/hooks/UseCart.tsx (indirecto)
        Razón: `CartItem` es el tipo central y `UseCart` provee las funciones
                     (`addToCart`, `removeFromCart`) que `CartItemComponent` consume via
                     `useCartContext`. Aunque `UseCart` no importa el componente visual,
                     ambos están acoplados conceptualmente: el hook maneja estado y el
                     componente lo presenta.

    Nota: `CartItemComponent` depende del hook de contexto `useCartContext` para
    modificar el carrito, y del tipo `CartItem` definido en `src/types/Cart.ts`.
*/
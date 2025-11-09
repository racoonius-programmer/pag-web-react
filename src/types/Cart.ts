/**
 * types/Cart.ts
 * ----------------
 * 
 * - `CartItem` extiende la interfaz `Product` añadiendo la propiedad `cantidad`.
 * - Se usa para representar un producto seleccionado por el usuario junto con
 *   la cantidad deseada en el carrito.
 *
 * Notas:
 * - No almacenan lógica en estos tipos: sólo describen la forma de los datos.
 * - `cantidad` es un número entero > 0 que indica cuántas unidades del `Product`
 *   están en el carrito.
 */


// Importamos la interfaz `Product` para reutilizar sus campos (codigo, nombre, precio, etc.).
import type { Product } from './Product'; 

// Interfaz para un ítem dentro del carrito: todos los campos de Product + cantidad.
export interface CartItem extends Product {
        cantidad: number; // Número de unidades de este producto en el carrito
}

/*
    Archivos que usan `CartItem` y por qué:

    - src/hooks/UseCart.tsx
        -> Define el estado `cart: CartItem[]`, las funciones para añadir/quitar items
             y la persistencia en localStorage. Es la fuente de verdad del carrito.

    - src/components/CartItem.tsx
        -> Componente que recibe un `item: CartItem` y renderiza la fila del carrito
             (cantidad, subtotal, controles para modificar/cambiar cantidad).

    - src/pages/ProductsCarrito.tsx
        -> Página que muestra la lista completa de `CartItem` (usa `CartItemComponent`
             para cada elemento) y acciones globales como vaciar el carrito o proceder
             al pago.

    Resumen:
    - `CartItem` es el tipo central para cualquier código que manipule el carrito de compras.
*/
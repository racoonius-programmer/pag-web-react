// IMPORTAMOS LA INTERFAZ 'Product' del archivo './Product'
import type { Product } from './Product'; 

// Interfaz para un ítem dentro del carrito
export interface CartItem extends Product {
    cantidad: number; // Agregamos la cantidad
}       
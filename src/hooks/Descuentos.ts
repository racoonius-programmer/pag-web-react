/*
    Cambios realizados:
    - Este hook ahora obtiene `usuarioActual` desde `sessionStorage` mediante
        `getSessionItem` para decidir si aplica el descuento DUOC.
    - Razonamiento: la pertenencia a una sesión activa afecta al cálculo del
        descuento; centralizamos la lectura en `useSessionStorage`.
*/
// src/hooks/useDescuento.ts
import { useMemo } from 'react';
import type { Product } from '../types/Product';
import type { UsuarioSesion } from '../types/User'; 
import { getSessionItem } from './useSessionStorage';
import { getSessionItem } from './useSessionStorage';

/**
 * Hook personalizado que calcula el precio final de un producto aplicando el descuento Duoc
 * basado en el usuario logueado en localStorage.
 * * @param producto El objeto del producto.
 * @returns Un objeto con el precio final (number) y un booleano (tieneDescuento).
 */
export const usarDescuento = (producto: Product) => {
    
    // Utilizamos useMemo para asegurar que este cálculo costoso solo se ejecute 
    // cuando el producto (o implícitamente, el usuario logueado) cambie.
    const { precioFinal, tieneDescuento } = useMemo(() => {
        
        // 1. Obtener el usuario desde sessionStorage
        const usuarioActualJSON = getSessionItem('usuarioActual');
        const usuario: UsuarioSesion | undefined = usuarioActualJSON ? JSON.parse(usuarioActualJSON) : undefined;
        
        // 2. Definir la condición de descuento (simulación)
        const esUsuarioDuocSimulado = usuario && 
                                     usuario.rol === 'user' && 
                                     usuario.username.toLowerCase().includes('duoc');
        
        const tieneDescuento = esUsuarioDuocSimulado;
        
        // 3. Calcular el precio
        const precioBase = producto.precio;
        const precioFinal = tieneDescuento ? Math.round(precioBase * 0.8) : precioBase;
        
        return { precioFinal, tieneDescuento };
        
    }, [producto]); // Dependencia: solo recalcular si el producto cambia.

    return { precioFinal, tieneDescuento };
};
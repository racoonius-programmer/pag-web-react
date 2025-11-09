import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types/Product';
import type { CartItem } from '../types/Cart';


// ----------------------------------------------------------------------
// Tipo del contexto del carrito
// ----------------------------------------------------------------------
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (codigo: string, quantityToRemove?: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

// ----------------------------------------------------------------------
// Creación del contexto
// ----------------------------------------------------------------------
const CartContext = createContext<CartContextType | undefined>(undefined);

// ----------------------------------------------------------------------
// Hook interno con la lógica del carrito
// (NO se exporta directamente)
// ----------------------------------------------------------------------
const useCart = () => {
  // Estado inicial del carrito (intenta leer desde localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem('carrito');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error al obtener el carrito de localStorage:', error);
      return [];
    }
  });

  // Efecto: guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(cart));
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.codigo === product.codigo);
      if (existingItem) {
        // Si el producto ya existe, aumenta su cantidad
        return prevCart.map(item =>
          item.codigo === product.codigo
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        );
      } else {
        // Si es nuevo, lo agrega con la cantidad indicada
        return [...prevCart, { ...product, cantidad: quantity } as CartItem];
      }
    });
  };

  // Remover producto (una o varias unidades)
  const removeFromCart = (codigo: string, quantityToRemove: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.codigo === codigo);
      if (!existingItem) return prevCart;

      const newQuantity = existingItem.cantidad - quantityToRemove;

      // Si la cantidad llega a 0 o menos, se elimina del carrito
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.codigo !== codigo);
      }

      // Si aún quedan unidades, actualiza la cantidad
      return prevCart.map(item =>
        item.codigo === codigo
          ? { ...item, cantidad: newQuantity }
          : item
      );
    });
  };

  // Vaciar todo el carrito
  const clearCart = () => {
    setCart([]);
  };

  // Calcular el monto total
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }, [cart]);

  return { cart, addToCart, removeFromCart, clearCart, totalAmount };
};

// ----------------------------------------------------------------------
// Provider del contexto (se exporta)
// ----------------------------------------------------------------------

interface CartProviderProps {
  children: ReactNode;
}
// Props para el Provider del carrito
//   Se usa para envolver la app en `main.tsx` y así distribuir el estado del carrito
//   a cualquier componente que lo necesite mediante `useCartContext()`.
interface CartProviderProps {
  children: ReactNode;
}

// CartProvider
// - Componente que envuelve la aplicación y proporciona el contexto del carrito.
// - Internamente llama a `useCart()` (hook interno que contiene la lógica del carrito)
//   y expone sus funciones/estado a través del contexto `CartContext`.
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const cartFunctions = useCart(); // obtiene { cart, addToCart, removeFromCart, ... }

  return (
    // El value del Provider es el objeto con las funciones y estado del carrito
    <CartContext.Provider value={cartFunctions}>
      {children}
    </CartContext.Provider>
  );
};

// ----------------------------------------------------------------------
// Hook de consumo: useCartContext
// - Este es el hook que deben usar los componentes cuando necesitan acceder
//   al carrito (leer items, agregar, remover, vaciar o consultar total).
// - Lanza un error claro si se intenta usar fuera del provider 
//
// Motivo: preferimos exponer solo este hook a los componentes en lugar de
// exponer el contexto directamente para mantener una API simple y tipada.
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    // Mensaje intencionalmente claro para que el dev sepa envolver la app
    throw new Error('useCartContext debe usarse dentro de un CartProvider');
  }
  return context;
};

/*
  Archivos que importan / usan este hook / provider en el proyecto y por qué:

  - src/main.tsx
    * Importa y usa <CartProvider> para envolver la aplicación. Esto es necesario
      para que cualquier componente pueda acceder al carrito usando `useCartContext()`.

  - src/pages/ProductsCarrito.tsx
    * Importa `useCartContext` para leer los items del carrito (`cart`) y el
      `totalAmount`, y para permitir acciones como `clearCart`.

  - src/pages/ProductDetail.tsx
    * Importa `useCartContext` para poder agregar el producto mostrado al carrito
      usando `addToCart`.

  - src/pages/Payment.tsx
    * Usa `useCartContext` para obtener el carrito y el monto total al realizar el pago,
      y para vaciar el carrito después del pago con `clearCart`.

  - src/components/ProductCard.tsx
    * Consume `useCartContext` para exponer un botón "Agregar" que llama `addToCart`.

  - src/components/CartItem.tsx
    * Consume `useCartContext` para permitir incrementar/decrementar o eliminar
      unidades mediante `addToCart` / `removeFromCart`.
*/

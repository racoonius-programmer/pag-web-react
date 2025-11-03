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

export const CartProvider: React.FC<CartProviderProps> = ({children}) => {
  const cartFunctions = useCart();

  return (
    <CartContext.Provider value={cartFunctions}>
      {children}
    </CartContext.Provider>
  );
};





// ----------------------------------------------------------------------
// Hook de consumo (se usa en componentes)
// ----------------------------------------------------------------------
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext debe usarse dentro de un CartProvider');
  }
  return context;
};

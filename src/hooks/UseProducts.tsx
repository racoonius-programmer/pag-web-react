import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';
import productosDB from '../data/productos.json';

/*
  useProducts - Hook personalizado para gestionar la lista de productos.

  Resumen:
  - Carga la lista de productos desde `localStorage` si existe, o desde
    `src/data/productos.json` como fuente inicial.
  - Proporciona funciones para CRUD en memoria y sincroniza los cambios
    en `localStorage` para persistencia ligera.
*/
export const useProducts = () => {
    // Estado principal: array de productos
    const [productos, setProductos] = useState<Product[]>([]);

    // Cargar productos al inicializar el hook (equivalente a componentDidMount)
    useEffect(() => {
        loadProducts();
    }, []);

    // loadProducts:
    // - Intenta leer primero desde localStorage (permite modificaciones persistentes)
    // - Si no existe nada en localStorage, carga la DB inicial (productosDB)
    // - En caso de error, hace fallback a productosDB y escribe en consola
    const loadProducts = () => {
        try {
            // Intentar cargar desde localStorage primero
            const storedProducts = localStorage.getItem('productos');
            if (storedProducts) {
                const parsedProducts = JSON.parse(storedProducts);
                setProductos(parsedProducts);
            } else {
                // Si no hay productos en localStorage, usar los de la DB inicial
                const initialProducts = productosDB as Product[];
                setProductos(initialProducts);
                // Guardar en localStorage para futuras modificaciones
                localStorage.setItem('productos', JSON.stringify(initialProducts));
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            // Fallback: usar productos de la DB
            setProductos(productosDB as Product[]);
        }
    };

    // saveProducts:
    // - Actualiza localStorage y el estado local con la lista proporcionada
    const saveProducts = (newProducts: Product[]) => {
        try {
            localStorage.setItem('productos', JSON.stringify(newProducts));
            setProductos(newProducts);
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    };

    // addProduct:
    // - Recibe un producto sin `codigo`, genera un `codigo` único y lo añade
    // - Devuelve el producto creado (con código) para que el llamador lo use si lo necesita
    const addProduct = (newProduct: Omit<Product, 'codigo'>) => {
        // Generar un nuevo código único
        const newCode = generateUniqueCode();
        const productWithCode = {
            codigo: newCode,
            ...newProduct
        } as Product;
        
        const updatedProducts = [...productos, productWithCode];
        saveProducts(updatedProducts);
        return productWithCode;
    };

    // updateProduct:
    // - Actualiza los campos de un producto identificado por `codigo`.
    // - Mantiene el `codigo` original para evitar colisiones.
    const updateProduct = (codigo: string, updatedProduct: Partial<Product>) => {
        const updatedProducts = productos.map(product => 
            product.codigo === codigo 
                ? { ...product, ...updatedProduct, codigo } // Mantener el código original
                : product
        );
        saveProducts(updatedProducts);
    };

    // deleteProduct: elimina un producto por su código
    const deleteProduct = (codigo: string) => {
        const updatedProducts = productos.filter(product => product.codigo !== codigo);
        saveProducts(updatedProducts);
    };

    // cloneProduct:
    // - Crea una copia de un producto existente con un nuevo código y sufijo en el nombre
    // - Devuelve el producto clonado o null si no se encontró el original
    const cloneProduct = (codigo: string) => {
        const productToClone = productos.find(p => p.codigo === codigo);
        if (!productToClone) return null;

        const newCode = generateUniqueCode();
        const clonedProduct: Product = {
            ...productToClone,
            codigo: newCode,
            nombre: `${productToClone.nombre} (Copia)`
        };

        const updatedProducts = [...productos, clonedProduct];
        saveProducts(updatedProducts);
        return clonedProduct;
    };

    // generateUniqueCode:
    // - Genera un código en formato `PR###` que no exista en los productos actuales.
    const generateUniqueCode = (): string => {
        let newCode: string;
        let isUnique = false;
        
        while (!isUnique) {
            // Generar código aleatorio (ej: "PR001", "PR002", etc.)
            const randomNum = Math.floor(Math.random() * 9999) + 1;
            newCode = `PR${randomNum.toString().padStart(3, '0')}`;
            
            // Verificar si el código ya existe
            isUnique = !productos.some(p => p.codigo === newCode);
        }
        
        return newCode!;
    };

    return {
        productos,
        addProduct,
        updateProduct,
        deleteProduct,
        cloneProduct,
        loadProducts
    };
};

/*
  Usos de este hook `useProducts` en el proyecto:
  - src/pages/ProductShop.tsx
    * Importa `{ useProducts }` para obtener la lista de productos que se muestran en la tienda pública.

  - src/pages/admin/Admin_Products.tsx
    * Usa `{ productos, addProduct, updateProduct, deleteProduct, cloneProduct }`
      para listar y administrar productos desde el panel de administración.

  - src/pages/admin/Admin_Dashboard.tsx
    * Usa `{ productos }` para mostrar métricas/resumenes rápidos en el dashboard admin.
*/
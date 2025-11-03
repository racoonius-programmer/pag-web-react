import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';
import productosDB from '../data/productos.json';

export const useProducts = () => {
    const [productos, setProductos] = useState<Product[]>([]);

    // Cargar productos al inicializar
    useEffect(() => {
        loadProducts();
    }, []);

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

    const saveProducts = (newProducts: Product[]) => {
        try {
            localStorage.setItem('productos', JSON.stringify(newProducts));
            setProductos(newProducts);
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    };

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

    const updateProduct = (codigo: string, updatedProduct: Partial<Product>) => {
        const updatedProducts = productos.map(product => 
            product.codigo === codigo 
                ? { ...product, ...updatedProduct, codigo } // Mantener el código original
                : product
        );
        saveProducts(updatedProducts);
    };

    const deleteProduct = (codigo: string) => {
        const updatedProducts = productos.filter(product => product.codigo !== codigo);
        saveProducts(updatedProducts);
    };

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
import { useState, useEffect } from 'react';
import type { Product } from '../types/Product';
import { ProductoService } from '../services/producto.service';

export const useProducts = () => {
    const [productos, setProductos] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar productos desde la API al inicializar
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const productosFromApi = await ProductoService.listar();
            setProductos(productosFromApi);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('Error al cargar productos desde la base de datos');
            setProductos([]);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (newProduct: Omit<Product, 'codigo'>) => {
        try {
            setLoading(true);
            const productCreated = await ProductoService.crear(newProduct);
            setProductos(prev => [...prev, productCreated]);
            return productCreated;
        } catch (error) {
            console.error('Error al crear producto:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (codigo: string, updatedProduct: Partial<Product>) => {
        try {
            setLoading(true);
            const { codigo: _, ...productPayload } = updatedProduct;
            const productUpdated = await ProductoService.actualizar(codigo, productPayload);
            setProductos(prev => 
                prev.map(product => 
                    product.codigo === codigo ? productUpdated : product
                )
            );
            return productUpdated;
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (codigo: string) => {
        try {
            setLoading(true);
            await ProductoService.eliminar(codigo);
            setProductos(prev => prev.filter(product => product.codigo !== codigo));
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const cloneProduct = async (codigo: string) => {
        try {
            setLoading(true);
            const productToClone = productos.find(p => p.codigo === codigo);
            if (!productToClone) {
                throw new Error('Producto no encontrado');
            }

            const { codigo: _, ...productWithoutCode } = productToClone;
            const clonedProduct = await ProductoService.crear({
                ...productWithoutCode,
                nombre: `${productToClone.nombre} (Copia)`
            });

            setProductos(prev => [...prev, clonedProduct]);
            return clonedProduct;
        } catch (error) {
            console.error('Error al clonar producto:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const buscarProductos = async (termino: string) => {
        try {
            setLoading(true);
            const productosEncontrados = await ProductoService.buscar(termino);
            return productosEncontrados;
        } catch (error) {
            console.error('Error al buscar productos:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const buscarPorCategoria = async (categoria: string) => {
        try {
            setLoading(true);
            const productosPorCategoria = await ProductoService.buscarPorCategoria(categoria);
            return productosPorCategoria;
        } catch (error) {
            console.error('Error al buscar productos por categoría:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        productos,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        cloneProduct,
        loadProducts,
        buscarProductos,
        buscarPorCategoria
    };
};
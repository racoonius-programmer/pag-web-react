import axios from 'axios';
import type { Product } from '../types/Product';

export type ProductoPayload = Omit<Product, 'codigo'>;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const resource = '/productos';

export const ProductoService = {
  async listar(): Promise<Product[]> {
    const { data } = await apiClient.get<Product[]>(resource);
    return Array.isArray(data) ? data : [];
  },

  async obtener(codigo: string): Promise<Product> {
    const { data } = await apiClient.get<Product>(`${resource}/${codigo}`);
    return data;
  },

  async crear(producto: ProductoPayload): Promise<Product> {
    const { data } = await apiClient.post<Product>(resource, producto);
    return data;
  },

  async actualizar(codigo: string, producto: ProductoPayload): Promise<Product> {
    const { data } = await apiClient.put<Product>(`${resource}/${codigo}`, producto);
    return data;
  },

  async eliminar(codigo: string): Promise<void> {
    await apiClient.delete(`${resource}/${codigo}`);
  },

  // Método para buscar productos por categoría
  async buscarPorCategoria(categoria: string): Promise<Product[]> {
    const productos = await this.listar();
    return productos.filter(p => p.categoria === categoria);
  },

  // Método para buscar productos por término de búsqueda
  async buscar(termino: string): Promise<Product[]> {
    const productos = await this.listar();
    const terminoLower = termino.toLowerCase();
    return productos.filter(p => 
      p.nombre.toLowerCase().includes(terminoLower) ||
      p.Descripcion?.toLowerCase().includes(terminoLower) ||
      p.categoria?.toLowerCase().includes(terminoLower)
    );
  }
};

export default ProductoService;
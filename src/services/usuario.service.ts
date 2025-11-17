import axios from 'axios';
import type { Usuario } from '../types/User';

export type UsuarioPayload = Omit<Usuario, 'id'>;
//PayLoad concepto usado para el transporte desde un punto a otro de un objeto en este caso omite id porque es
//autoincrement

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const resource = '/usuarios';

export const UsuarioService = {
  async listar(): Promise<Usuario[]> {
    const { data } = await apiClient.get<Usuario[]>(resource);
    return Array.isArray(data) ? data : [];
  },

  async obtener(id: number): Promise<Usuario> {
    const { data } = await apiClient.get<Usuario>(`${resource}/${id}`);
    return data;
  },

  async crear(usuario: UsuarioPayload): Promise<Usuario> {
    const { data } = await apiClient.post<Usuario>(resource, usuario);
    return data;
  },

  async actualizar(id: number, usuario: UsuarioPayload): Promise<Usuario> {
    const { data } = await apiClient.put<Usuario>(`${resource}/${id}`, usuario);
    return data;
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`${resource}/${id}`);
  }
};

export default UsuarioService;
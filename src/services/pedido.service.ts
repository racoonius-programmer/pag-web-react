import axios from 'axios';
import type { Pedido, PedidoPayload } from '../types/Pedido';

// Seguir la convención de los otros servicios: URL base tomada desde env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const resource = '/pedidos';

/**
 * Servicio para interactuar con la API de Pedidos.
 * Diseñado para trabajar con una API real (no con JSON local).
 * Métodos: listar (admin), obtener, listarPorUsuario, crear, actualizarEstado
 */
export const PedidoService = {
  async listar(): Promise<Pedido[]> {
    const { data } = await apiClient.get<Pedido[]>(resource);
    return Array.isArray(data) ? data : [];
  },

  async obtener(id: number): Promise<Pedido> {
    const { data } = await apiClient.get<Pedido>(`${resource}/${id}`);
    return data;
  },

  async listarPorUsuario(clienteId: number): Promise<Pedido[]> {
    // Se asume que el backend soporta filtro por query ?clienteId=123
    const { data } = await apiClient.get<Pedido[]>(resource, {
      params: { clienteId }
    });
    return Array.isArray(data) ? data : [];
  },

  async crear(payload: PedidoPayload): Promise<Pedido> {
    // El servidor debe asignar id y fecha
    // DEBUG: log payload (útil para comprobar que el frontend envía lo que el backend espera)
    try {
      // Imprimir en consola del navegador gracias a axios en frontend
      // (en desarrollo esto aparecerá en DevTools -> Network/Console cuando se invoque)
      // Nota: no incluir información sensible en producción.
      // eslint-disable-next-line no-console
      console.log('[PedidoService] crear payload ->', payload);
      const { data } = await apiClient.post<Pedido>(resource, payload);
      // eslint-disable-next-line no-console
      console.log('[PedidoService] crear response ->', data);
      return data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PedidoService] error crear ->', err);
      throw err;
    }
  },

  async actualizar(id: number, payload: Partial<Pedido>): Promise<Pedido> {
    const { data } = await apiClient.put<Pedido>(`${resource}/${id}`, payload);
    return data;
  },

  async actualizarEstado(id: number, estado: Pedido['estado']): Promise<Pedido> {
    // Punto final para actualizar solo el estado (si existe en API)
    const { data } = await apiClient.patch<Pedido>(`${resource}/${id}/estado`, { estado });
    return data;
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`${resource}/${id}`);
  }
};

export default PedidoService;

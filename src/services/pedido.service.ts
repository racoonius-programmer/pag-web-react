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
    // Usar el parámetro usuarioId que implementaste en el backend
    const { data } = await apiClient.get<Pedido[]>(resource, {
      params: { usuarioId: clienteId }
    });
    
    const pedidosDelUsuario = Array.isArray(data) ? data : [];
    
    // eslint-disable-next-line no-console
    console.log(`[PedidoService] Obtenidos ${pedidosDelUsuario.length} pedidos para usuario ${clienteId}`);
    
    return pedidosDelUsuario;
  },

  async crear(payload: PedidoPayload): Promise<Pedido> {
    // El servidor debe asignar id y fecha
    // DEBUG: log payload (útil para comprobar que el frontend envía lo que el backend espera)
    try {
      // Procesar productos para asegurar tipos correctos según el modelo Java
      const productosProcessed = payload.productos.map((producto: any) => ({
        codigo: producto.codigo,
        nombre: producto.nombre,
        cantidad: Number(producto.cantidad), // Integer en Java
        precio: Number(producto.precio) // Double en Java
      }));

      // Crear el payload completo con el formato exacto que espera el backend Java
      const payloadCompleto = {
        clienteId: payload.clienteId, // camelCase como en el modelo Java
        productos: productosProcessed, // Array de objetos, NO string JSON
        estado: payload.estado || 'en preparacion',
        fecha: new Date().toISOString() // String ISO como espera el backend
        // El total lo calcula automáticamente el servicio Java
        // Campos opcionales se omiten por ahora
      };

      // Imprimir en consola del navegador gracias a axios en frontend
      // (en desarrollo esto aparecerá en DevTools -> Network/Console cuando se invoque)
      // Nota: no incluir información sensible en producción.
      // eslint-disable-next-line no-console
      console.log('[PedidoService] crear payload ->', payloadCompleto);
      
      const { data } = await apiClient.post<Pedido>(resource, payloadCompleto);
      // eslint-disable-next-line no-console
      console.log('[PedidoService] crear response ->', data);
      return data;
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('[PedidoService] error crear ->', err);
      
      // Proporcionar más detalles del error si están disponibles
      if (err.response) {
        // eslint-disable-next-line no-console
        console.error('[PedidoService] error response data ->', err.response.data);
        // eslint-disable-next-line no-console
        console.error('[PedidoService] error response status ->', err.response.status);
        // eslint-disable-next-line no-console
        console.error('[PedidoService] error response headers ->', err.response.headers);
        
        // Crear un error más descriptivo para el usuario
        const errorMessage = err.response.data?.message || 
                           err.response.data?.error || 
                           `Error ${err.response.status}: ${err.response.statusText}`;
        
        const errorDetail = err.response.data?.details || 
                          err.response.data?.trace || 
                          'No hay detalles adicionales disponibles';
        
        // eslint-disable-next-line no-console
        console.error('[PedidoService] Error detallado ->', { errorMessage, errorDetail });
        
        // Crear un nuevo error con más información
        const detailedError = new Error(`Error al crear pedido: ${errorMessage}`);
        (detailedError as any).originalError = err;
        (detailedError as any).details = errorDetail;
        (detailedError as any).status = err.response.status;
        
        throw detailedError;
      }
      
      throw err;
    }
  },

  async actualizar(id: number, payload: Partial<Pedido>): Promise<Pedido> {
    const { data } = await apiClient.put<Pedido>(`${resource}/${id}`, payload);
    return data;
  },

  async actualizarEstado(id: number, estado: Pedido['estado']): Promise<Pedido> {
    // El backend espera recibir directamente el string del estado, no un objeto JSON
    const { data } = await apiClient.patch<Pedido>(`${resource}/${id}/estado`, estado, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    return data;
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`${resource}/${id}`);
  }
};

export default PedidoService;

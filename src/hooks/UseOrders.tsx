import { useState, useEffect } from 'react';
import type { Pedido } from '../types/Pedido';
import { PedidoService } from '../services/pedido.service';

/**
 * Hook para manejar pedidos desde la UI. Sigue la misma filosofía que `useProducts`:
 * - mantiene lista local
 * - provee funciones para crear/actualizar/recargar
 * - preparado para trabajar con una API real
 */
export const useOrders = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No cargamos automáticamente todos los pedidos porque en cliente
    // normalmente queremos solo los del usuario logueado. Dejar disponible.
    setLoading(false);
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const lista = await PedidoService.listar();
      setPedidos(lista);
      return lista;
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      setError('Error al cargar pedidos');
      setPedidos([]);
      return [] as Pedido[];
    } finally {
      setLoading(false);
    }
  };

  const loadByUser = async (clienteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const lista = await PedidoService.listarPorUsuario(clienteId);
      setPedidos(lista);
      return lista;
    } catch (err) {
      console.error('Error al cargar pedidos por usuario:', err);
      setError('Error al cargar pedidos del usuario');
      setPedidos([]);
      return [] as Pedido[];
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (payload: Omit<Pedido, 'id' | 'fecha' | 'total'>) => {
    try {
      setLoading(true);
      const nuevo = await PedidoService.crear(payload);
      setPedidos(prev => [...prev, nuevo]);

      // Notificar a otras pestañas/ventanas mediante BroadcastChannel para que
      // puedan actualizar su UI en tiempo real sin requerir polling.
      try {
        const channel = new BroadcastChannel('levelup-pedidos');
        channel.postMessage({ type: 'pedido_created', pedido: nuevo });
        channel.close();
      } catch (bcErr) {
        // BroadcastChannel puede no estar disponible en algunos entornos (ej: IE).
        // No bloqueamos la operación principal por esto; registramos para debug.
        // eslint-disable-next-line no-console
        console.warn('BroadcastChannel no disponible o fallo al postear mensaje:', bcErr);
      }

      return nuevo;
    } catch (err) {
      console.error('Error al crear pedido:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, estado: Pedido['estado']) => {
    try {
      setLoading(true);
      const actualizado = await PedidoService.actualizarEstado(id, estado);
      setPedidos(prev => prev.map(p => (p.id === id ? actualizado : p)));
      return actualizado;
    } catch (err) {
      console.error('Error al actualizar estado del pedido:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    pedidos,
    loading,
    error,
    loadAll,
    loadByUser,
    createOrder,
    updateStatus
  };
};

export default useOrders;

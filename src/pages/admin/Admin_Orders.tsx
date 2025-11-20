import React, { useEffect, useState } from 'react';
import useOrders from '../../hooks/UseOrders';
import OrderCard from '../../components/OrderCard';

/**
 * Vista de administración para revisar pedidos.
 * - Muestra todos los pedidos
 * - Permite filtrar por `clienteId` para ver pedidos de un cliente concreto
 * - Permite marcar pedidos como entregados
 */
const AdminOrders: React.FC = () => {
  const { pedidos, loading, error, loadAll, loadByUser, updateStatus } = useOrders();
  const [clienteIdFiltro, setClienteIdFiltro] = useState<string>('');

  useEffect(() => {
    // Cargar todos al entrar
    loadAll();
  }, []);

  // Polling: recarga periódica de pedidos para que el admin vea nuevos pedidos sin
  // tener que refrescar manualmente la página. Si hay un filtro por cliente, se
  // recargan los pedidos de ese cliente; si no, se recargan todos.
  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        if (clienteIdFiltro) {
          const id = Number(clienteIdFiltro);
          if (!Number.isNaN(id)) {
            await loadByUser(id);
          }
        } else {
          await loadAll();
        }
      } catch (err) {
        // No bloqueamos la UI por errores de polling; los logueamos para debug.
        // eslint-disable-next-line no-console
        console.error('[AdminOrders] error en polling:', err);
      }
    }, 8000); // cada 8s

    return () => clearInterval(intervalo);
  }, [clienteIdFiltro]);

  const handleBuscar = async () => {
    if (!clienteIdFiltro) {
      await loadAll();
      return;
    }
    const id = Number(clienteIdFiltro);
    if (Number.isNaN(id)) return;
    await loadByUser(id);
  };

  const handleMarcarEntregado = async (id: number, estado: any) => {
    try {
      await updateStatus(id, estado);
      // recargar lista
      await loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="text-white mb-3">Administración de Pedidos</h3>

      <div className="mb-3 d-flex">
        <input
          className="form-control me-2"
          placeholder="Filtrar por clienteId"
          value={clienteIdFiltro}
          onChange={e => setClienteIdFiltro(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleBuscar}>Buscar</button>
        <button className="btn btn-secondary ms-2" onClick={() => { setClienteIdFiltro(''); loadAll(); }}>
          Mostrar todo
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-white">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="text-white">No hay pedidos.</div>
      ) : (
        pedidos.map(p => (
          <OrderCard key={p.id} pedido={p} isAdmin onUpdateStatus={handleMarcarEntregado} />
        ))
      )}
    </div>
  );
};

export default AdminOrders;

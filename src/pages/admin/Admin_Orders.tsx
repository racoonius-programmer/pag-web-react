import React, { useEffect, useState } from 'react';
import useOrders from '../../hooks/UseOrders';
import OrderCard from '../../components/OrderCard';

/**
 * Vista de administración para revisar pedidos.
 * - Muestra todos los pedidos
 * - Permite filtrar por `clienteId` y estado
 * - Permite marcar pedidos como entregados
 * - Búsqueda en tiempo real
 */
const AdminOrders: React.FC = () => {
  const { pedidos, loading, error, loadAll, loadByUser, updateStatus } = useOrders();
  const [clienteIdFiltro, setClienteIdFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  
  // Estado para filtros locales (sin hacer llamadas a la API)
  const [pedidosFiltrados, setPedidosFiltrados] = useState(pedidos);

  useEffect(() => {
    // Cargar todos al entrar
    loadAll();
  }, []);

  // Aplicar filtros locales cuando cambian los pedidos o los filtros
  useEffect(() => {
    let filtrados = [...pedidos];
    
    // Filtrar por cliente ID
    if (clienteIdFiltro) {
      const id = Number(clienteIdFiltro);
      if (!Number.isNaN(id)) {
        filtrados = filtrados.filter(pedido => pedido.clienteId === id);
      }
    }
    
    // Filtrar por estado
    if (estadoFiltro) {
      filtrados = filtrados.filter(pedido => pedido.estado === estadoFiltro);
    }
    
    setPedidosFiltrados(filtrados);
  }, [pedidos, clienteIdFiltro, estadoFiltro]);

  // POLLING DESHABILITADO: Para evitar consultas innecesarias a la BD
  // Los pedidos se actualizan solo con el botón "Refrescar" o al cargar la página
  // useEffect(() => {
  //   const intervalo = setInterval(async () => {
  //     try {
  //       await loadAll();
  //     } catch (err) {
  //       console.error('[AdminOrders] error en polling:', err);
  //     }
  //   }, 10000);
  //   return () => clearInterval(intervalo);
  // }, []);

  const handleRefrescar = async () => {
    await loadAll();
  };

  const handleLimpiarFiltros = () => {
    setClienteIdFiltro('');
    setEstadoFiltro('');
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

  // Estadísticas rápidas
  const totalPedidos = pedidos.length;
  const pedidosEnPreparacion = pedidos.filter(p => p.estado === 'en preparacion').length;
  const pedidosEntregados = pedidos.filter(p => p.estado === 'entregado').length;
  const totalVentas = pedidos.reduce((sum, pedido) => sum + (pedido.total || 0), 0);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-white mb-0">Administración de Pedidos</h3>
        <button 
          className="btn btn-outline-light"
          onClick={handleRefrescar}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refrescar
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Pedidos</h5>
              <h3>{totalPedidos}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">En Preparación</h5>
              <h3>{pedidosEnPreparacion}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Entregados</h5>
              <h3>{pedidosEntregados}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Total Ventas</h5>
              <h3>${totalVentas.toLocaleString('es-ES')}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card bg-dark mb-4">
        <div className="card-header">
          <h5 className="text-white mb-0">Filtros</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label text-white">Cliente ID</label>
              <input
                className="form-control"
                placeholder="Ej: 1, 2, 3..."
                value={clienteIdFiltro}
                onChange={e => setClienteIdFiltro(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label text-white">Estado</label>
              <select 
                className="form-select"
                value={estadoFiltro}
                onChange={e => setEstadoFiltro(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="en preparacion">En preparación</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button 
                className="btn btn-secondary me-2"
                onClick={handleLimpiarFiltros}
              >
                <i className="bi bi-x-circle me-2"></i>
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-white">
          Mostrando {pedidosFiltrados.length} de {totalPedidos} pedidos
        </span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="text-white mt-2">Cargando pedidos...</div>
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-white">
            {totalPedidos === 0 ? 'No hay pedidos registrados.' : 'No hay pedidos que coincidan con los filtros aplicados.'}
          </div>
        </div>
      ) : (
        <div className="row">
          {pedidosFiltrados.map(p => (
            <div key={p.id} className="col-12 mb-3">
              <OrderCard pedido={p} isAdmin onUpdateStatus={handleMarcarEntregado} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

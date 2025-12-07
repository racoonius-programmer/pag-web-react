import React, { useEffect, useState } from 'react';
import useOrders from '../../hooks/UseOrders';
import OrderCard from '../../components/OrderCard';
import StickyContainer from '../../components/StickyContainer';
import type { Pedido } from '../../types/Pedido';

/**
 * Vista de administración para revisar pedidos.
 * - Muestra todos los pedidos en una tabla
 * - Permite filtrar por `clienteId` y estado
 * - Permite marcar pedidos como entregados
 * - Panel lateral con detalles del pedido seleccionado
 */
const AdminOrders: React.FC = () => {
  const { pedidos, loading, error, loadAll, loadByUser, updateStatus } = useOrders();
  const [clienteIdFiltro, setClienteIdFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  
  // Estado para filtros locales (sin hacer llamadas a la API)
  const [pedidosFiltrados, setPedidosFiltrados] = useState(pedidos);
  
  // Estado para el pedido seleccionado en el panel de detalles
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

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
      // Si el pedido seleccionado es el que se actualizó, actualizarlo
      if (selectedPedido && selectedPedido.id === id) {
        const pedidoActualizado = pedidos.find(p => p.id === id);
        if (pedidoActualizado) {
          setSelectedPedido(pedidoActualizado);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Funciones auxiliares
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'entregado': return 'success';
      case 'en preparacion': return 'warning';
      default: return 'secondary';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'entregado': return 'bi-check-circle-fill';
      case 'en preparacion': return 'bi-clock-fill';
      default: return 'bi-question-circle-fill';
    }
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Estadísticas rápidas
  const totalPedidos = pedidos.length;
  const pedidosEnPreparacion = pedidos.filter(p => p.estado === 'en preparacion').length;
  const pedidosEntregados = pedidos.filter(p => p.estado === 'entregado').length;
  const totalVentas = pedidos.reduce((sum, pedido) => sum + (pedido.total || 0), 0);

  return (
    <StickyContainer>
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
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title text-white">En Preparación</h5>
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
              <h5 className="card-title text-white">Total Ventas</h5>
              <h3>${totalVentas.toLocaleString('es-ES')}</h3>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="text-white mt-2">Cargando pedidos...</div>
        </div>
      ) : (
        <div className="row">
          {/* Filtros y búsqueda */}
          <div className="col-12">
            <div className="card bg-dark text-white mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Cliente ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ej: 1, 2, 3..."
                      value={clienteIdFiltro}
                      onChange={e => setClienteIdFiltro(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Estado</label>
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
                      className="btn btn-secondary"
                      onClick={handleLimpiarFiltros}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Limpiar Filtros
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de pedidos */}
          <div className="col-lg-8">
            <div className="card bg-dark text-white">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Pedidos</h5>
                <span className="text-muted">
                  Mostrando {pedidosFiltrados.length} de {totalPedidos} pedidos
                </span>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Cliente ID</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidosFiltrados.map(pedido => (
                        <tr 
                          key={pedido.id}
                          className={selectedPedido?.id === pedido.id ? 'table-warning' : ''}
                        >
                          <td>#{pedido.id}</td>
                          <td>{formatFecha(pedido.fecha)}</td>
                          <td>{pedido.clienteId}</td>
                          <td>{pedido.productos.length} items</td>
                          <td>
                            <span className="fw-bold">
                              ${(pedido.total || 0).toLocaleString('es-ES')}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-${getEstadoColor(pedido.estado)}`}>
                              <i className={`bi ${getEstadoIcon(pedido.estado)} me-1`}></i>
                              {pedido.estado}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-info"
                                onClick={() => setSelectedPedido(pedido)}
                                title="Ver detalles"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              {pedido.estado !== 'entregado' && (
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleMarcarEntregado(pedido.id, 'entregado')}
                                  title="Marcar como entregado"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pedidosFiltrados.length === 0 && (
                    <div className="text-center text-white py-4">
                      {totalPedidos === 0 
                        ? 'No hay pedidos registrados.' 
                        : 'No hay pedidos que coincidan con los filtros aplicados.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Panel de detalles del pedido */}
          <div className="col-lg-4">
            <div className="card bg-dark text-white">
              <div className="card-header">
                <h5 className="mb-0">Detalles del Pedido</h5>
              </div>
              <div className="card-body">
                {selectedPedido ? (
                  <OrderCard 
                    pedido={selectedPedido} 
                    isAdmin 
                    onUpdateStatus={handleMarcarEntregado} 
                  />
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-receipt display-4 mb-3"></i>
                    <p>Selecciona un pedido de la lista para ver sus detalles completos.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </StickyContainer>
  );
};

export default AdminOrders;

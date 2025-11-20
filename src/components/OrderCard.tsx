import React from 'react';
import type { Pedido } from '../types/Pedido';

type Props = {
  pedido: Pedido;
  isAdmin?: boolean;
  onUpdateStatus?: (id: number, estado: Pedido['estado']) => Promise<void> | void;
};

/**
 * Componente que muestra la información de un pedido.
 * - `isAdmin` habilita controles extra (p. ej. cambiar estado)
 * - `onUpdateStatus` callback opcional para notificar cambios al padre
 */
const OrderCard: React.FC<Props> = ({ pedido, isAdmin = false, onUpdateStatus }) => {
  const subtotal = (item: any) => (item.precio ?? 0) * (item.cantidad ?? 0);

  const totalCalculated = pedido.total ?? pedido.productos.reduce((s, p) => s + subtotal(p), 0);

  const handleMarcarEntregado = async () => {
    if (!onUpdateStatus) return;
    await onUpdateStatus(pedido.id, 'entregado');
  };

  // Determinar el color del estado
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
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-card card border-0 shadow-sm mb-3 overflow-hidden">
      {/* Header con gradiente */}
      <div 
        className={`order-card-header card-header border-0 text-white ${
          pedido.estado === 'entregado' ? 'entregado' : 'en-preparacion'
        }`}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <i className="bi bi-receipt-cutoff me-3" style={{ fontSize: '1.5rem' }}></i>
            <div>
              <h5 className="mb-0">Pedido #{pedido.id}</h5>
              <small className="opacity-75">
                <i className="bi bi-calendar3 me-1"></i>
                {formatFecha(pedido.fecha)}
              </small>
            </div>
          </div>
          <div className="text-end">
            <div className={`badge fs-6 mb-2 ${
              pedido.estado === 'entregado' ? 'badge-estado-entregado' : 'badge-estado-preparacion'
            }`}>
              <i className={`bi ${getEstadoIcon(pedido.estado)} me-1`}></i>
              {pedido.estado}
            </div>
            <div className="h4 mb-0">
              <i className="bi bi-currency-dollar me-1"></i>
              {totalCalculated.toLocaleString('es-ES')}
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Información del cliente (solo para admin) */}
        {isAdmin && (
          <div className="mb-3">
            <small className="text-muted">
              <i className="bi bi-person-fill me-1"></i>
              Cliente ID: {pedido.clienteId}
            </small>
          </div>
        )}

        {/* Lista de productos mejorada */}
        <div>
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-bag-check me-2 text-pedidos-primary"></i>
            <h6 className="mb-0 text-pedidos-white">Productos ({pedido.productos.length})</h6>
          </div>
          
          <div className="row g-2">
            {pedido.productos.map((p, idx) => (
              <div key={idx} className="col-12">
                <div className="order-product-item card border-0">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1 text-pedidos-white">{p.nombre || p.codigo}</h6>
                        <div className="d-flex align-items-center text-pedidos-light small">
                          <i className="bi bi-tag me-1"></i>
                          <span className="me-3">Código: {p.codigo}</span>
                          <i className="bi bi-x me-1"></i>
                          <span>{p.cantidad} unidades</span>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-pedidos-white">
                          ${p.precio?.toLocaleString('es-ES')} c/u
                        </div>
                        <div className="small text-pedidos-primary">
                          Subtotal: ${((p.precio ?? 0) * (p.cantidad ?? 0)).toLocaleString('es-ES')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total destacado */}
        <div className="border-top pt-3 mt-3" style={{ borderColor: '#444 !important' }}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="h6 mb-0 text-pedidos-light">Total del Pedido:</span>
            <span className="h4 mb-0 total-destacado fw-bold">
              ${totalCalculated.toLocaleString('es-ES')}
            </span>
          </div>
        </div>

        {/* Acciones de admin */}
        {isAdmin && pedido.estado !== 'entregado' && (
          <div className="border-top pt-3 mt-3" style={{ borderColor: '#444' }}>
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-pedidos-light">Acciones de administrador:</small>
              <button 
                className="btn btn-pedidos-success btn-sm"
                onClick={handleMarcarEntregado}
              >
                <i className="bi bi-check-circle me-1"></i>
                Marcar como entregado
              </button>
            </div>
          </div>
        )}

        {/* Indicador de estado para usuarios */}
        {!isAdmin && (
          <div className="border-top pt-3 mt-3" style={{ borderColor: '#444' }}>
            <div className="d-flex align-items-center">
              <i className={`bi ${getEstadoIcon(pedido.estado)} me-2 ${
                pedido.estado === 'entregado' ? 'text-pedidos-success' : 'text-pedidos-primary'
              }`}></i>
              <small className="text-pedidos-light">
                {pedido.estado === 'entregado' 
                  ? '¡Tu pedido ha sido entregado! Esperamos que disfrutes tus productos.' 
                  : 'Tu pedido está siendo preparado. Te notificaremos cuando esté listo.'}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;

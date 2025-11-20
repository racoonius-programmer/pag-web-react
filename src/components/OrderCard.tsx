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

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <h5 className="card-title">Pedido #{pedido.id}</h5>
            <p className="mb-1">Fecha: {new Date(pedido.fecha).toLocaleString()}</p>
            <p className="mb-1">Estado: <strong>{pedido.estado}</strong></p>
            <p className="mb-1">Cliente ID: {pedido.clienteId}</p>
          </div>
          <div className="text-end">
            <p className="mb-1">Total: <strong>${totalCalculated.toFixed(0)}</strong></p>
          </div>
        </div>

        <hr />

        <div>
          <h6>Productos</h6>
          <ul className="list-unstyled">
            {pedido.productos.map((p, idx) => (
              <li key={idx} className="d-flex justify-content-between">
                <div>
                  <small>{p.nombre ?? p.codigo}</small>
                  <div><small>Código: {p.codigo}</small></div>
                </div>
                <div className="text-end">
                  <small>x{p.cantidad} — ${p.precio}</small>
                  <div><small>Subtotal: ${((p.precio ?? 0) * (p.cantidad ?? 0)).toFixed(0)}</small></div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isAdmin && pedido.estado !== 'entregado' && (
          <div className="mt-3 text-end">
            <button className="btn btn-success" onClick={handleMarcarEntregado}>
              Marcar como entregado
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;

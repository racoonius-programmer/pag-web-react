import React, { useEffect, useState } from 'react';
import { useUsuarioActual } from '../hooks/UseUsuarioActual';
import useOrders from '../hooks/UseOrders';
import OrderCard from '../components/OrderCard';
import { useLocation } from 'react-router-dom';

/**
 * Nota: esta página ahora detecta si viene desde el flujo de pago
 * (location.state.fromPayment) y en ese caso fuerza una recarga de los pedidos
 * del usuario para asegurar que el nuevo pedido aparezca inmediatamente.
 */

/**
 * Página para que el cliente vea su historial de pedidos.
 * - Obtiene el usuario actual desde localStorage (o API) usando `useUsuarioActual`
 * - Llama `loadByUser` del hook `useOrders`
 */
const OrdersPage: React.FC = () => {
  const { usuario, loading: loadingUser } = useUsuarioActual();
  const { pedidos, loading, error, loadByUser } = useOrders();
  const location = useLocation();
  const [showCreatedBanner, setShowCreatedBanner] = useState(false);

  useEffect(() => {
    // Siempre intentar cargar los pedidos cuando este componente se monta y
    // hay un usuario disponible.
    if (usuario?.id) {
      loadByUser(usuario.id);
    }
  }, [usuario]);

  useEffect(() => {
    // Si venimos desde el flujo de pago, forzamos recarga y mostramos banner.
    // `location.state` es establecido por `Payment.tsx` al redirigir.
    try {
      // location.state puede ser null o un objeto, por eso comprobamos con seguridad
      const state: any = (location && (location as any).state) || {};
      if (state.fromPayment && usuario?.id) {
        // Forzamos recarga desde el servidor para obtener el pedido recién creado.
        loadByUser(usuario.id);
        setShowCreatedBanner(true);
        // Ocultar el banner después de unos segundos
        setTimeout(() => setShowCreatedBanner(false), 5000);
        // Intentamos limpiar el state para evitar recargas repetidas si el usuario
        // navega atrás/adelante; no siempre es posible sin history.replace, así que
        // simplemente dejamos que el banner desaparezca.
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error comprobando location.state en Orders:', err);
    }
  }, [location, usuario]);

  // Escuchar BroadcastChannel para actualizaciones en tiempo real desde otras pestañas
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('levelup-pedidos');
      const handler = (ev: MessageEvent) => {
        try {
          const data = ev.data || {};
          if (data && data.type === 'pedido_created') {
              const pedido = data.pedido;
              // Si el pedido pertenece al usuario actual, forzamos recarga desde el servidor
              if (usuario?.id && pedido?.clienteId === usuario.id) {
                try {
                  setShowCreatedBanner(true);
                  // Recargar la lista desde el servidor para evitar inconsistencias
                  loadByUser(usuario.id).catch(() => {
                    /* si falla la recarga, no bloqueamos la UI */
                  });
                  setTimeout(() => setShowCreatedBanner(false), 5000);
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error('Error recargando pedidos tras BroadcastChannel:', e);
                }
              }
            }
        } catch (inner) {
          // eslint-disable-next-line no-console
          console.error('Error manejando mensaje BroadcastChannel en Orders:', inner);
        }
      };
      channel.addEventListener('message', handler);

      return () => {
        try {
          channel?.removeEventListener('message', handler);
          channel?.close();
        } catch {
          // ignore
        }
      };
    } catch (err) {
      // BroadcastChannel no disponible: no hacemos nada.
      // eslint-disable-next-line no-console
      console.warn('BroadcastChannel no disponible en este entorno:', err);
    }
  }, [usuario]);

  if (loadingUser || loading) return <div className="p-4 text-white">Cargando pedidos...</div>;

  if (!usuario) return <div className="p-4 text-white">Debes iniciar sesión para ver tus pedidos.</div>;

  return (
    <div className="container py-4">
      <h3 className="text-white mb-3">Mis Pedidos</h3>

      {showCreatedBanner && (
        <div className="alert alert-success text-dark">Tu pedido se creó correctamente. Aquí puedes ver su estado.</div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {pedidos.length === 0 ? (
        <div className="text-white">No hay pedidos registrados para este usuario.</div>
      ) : (
        pedidos.map(p => (
          <OrderCard key={p.id} pedido={p} isAdmin={false} />
        ))
      )}
    </div>
  );
};

export default OrdersPage;

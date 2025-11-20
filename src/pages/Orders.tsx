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

  // Calcular estadísticas del usuario
  const totalGastado = pedidos.reduce((sum, pedido) => sum + (pedido.total || 0), 0);
  const pedidosEntregados = pedidos.filter(p => p.estado === 'entregado').length;
  const pedidosPendientes = pedidos.filter(p => p.estado === 'en preparacion').length;

  // Función para recargar pedidos manualmente
  const handleRefrescar = async () => {
    if (usuario?.id) {
      await loadByUser(usuario.id);
    }
  };

  if (loadingUser || loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="text-white">Cargando tus pedidos...</h5>
            <p className="text-white-50">Estamos obteniendo tu historial de compras</p>
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <div className="card bg-dark border-warning">
              <div className="card-body py-5">
                <i className="bi bi-person-x display-1 text-warning mb-3"></i>
                <h3 className="text-white mb-3">Acceso Requerido</h3>
                <p className="text-white-50 mb-4">
                  Debes iniciar sesión para ver tu historial de pedidos
                </p>
                <a href="/login" className="btn btn-warning btn-lg">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="container py-4">
        {/* Header con saludo personalizado */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h2 className="text-pedidos-white mb-1">
                  <i className="bi bi-receipt me-3 text-pedidos-primary icon-hover"></i>
                  Mis Pedidos
                </h2>
                <p className="text-pedidos-light mb-0">
                  Hola <span className="text-pedidos-success fw-bold">{usuario.username}</span>, aquí tienes tu historial de compras
                </p>
              </div>
              <div className="text-end">
                <button 
                  className="btn btn-pedidos-primary"
                  onClick={handleRefrescar}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2 spinner-pedidos"></span>
                      Cargando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Refrescar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de pedido creado */}
        {showCreatedBanner && (
          <div className="alert alert-pedidos-success border-0 shadow-sm mb-4 fade-in-up" role="alert">
            <div className="d-flex align-items-center">
              <i className="bi bi-check-circle-fill me-3" style={{ fontSize: '1.5rem', color: '#000' }}></i>
              <div>
                <h6 className="alert-heading mb-1" style={{ color: '#000' }}>¡Pedido creado exitosamente! 🎉</h6>
                <p className="mb-0" style={{ color: '#000' }}>Tu pedido se procesó correctamente y aparecerá a continuación.</p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas del usuario */}
        {pedidos.length > 0 && (
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card orders-stats-card stats-purple-blue">
                <div className="card-body text-white text-center">
                  <i className="bi bi-bag-check display-6 mb-2"></i>
                  <h4 className="mb-1 fw-bold">{pedidos.length}</h4>
                  <small className="fw-semibold">Total Pedidos</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card orders-stats-card stats-azul-electrico">
                <div className="card-body text-white text-center">
                  <i className="bi bi-clock-history display-6 mb-2"></i>
                  <h4 className="mb-1 fw-bold">{pedidosPendientes}</h4>
                  <small className="fw-semibold">En Preparación</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card orders-stats-card stats-verde-neon">
                <div className="card-body text-dark text-center">
                  <i className="bi bi-check-circle display-6 mb-2"></i>
                  <h4 className="mb-1 fw-bold">{pedidosEntregados}</h4>
                  <small className="fw-semibold">Entregados</small>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card orders-stats-card stats-orange-pink">
                <div className="card-body text-white text-center">
                  <i className="bi bi-currency-dollar display-6 mb-2"></i>
                  <h4 className="mb-1 fw-bold">${totalGastado.toLocaleString('es-ES')}</h4>
                  <small className="fw-semibold">Total Gastado</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensajes de error */}
        {error && (
          <div className="alert alert-danger border-0 shadow-sm mb-4" role="alert" style={{ backgroundColor: '#dc3545', color: '#fff' }}>
            <div className="d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-3" style={{ fontSize: '1.5rem' }}></i>
              <div>
                <h6 className="alert-heading mb-1 text-white">Error al cargar pedidos</h6>
                <p className="mb-0 text-white">{error}</p>
              </div>
            </div>
          </div>
        )}

      {/* Contenido principal */}
      {pedidos.length === 0 ? (
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="empty-state-card card shadow-lg">
                <div className="card-body text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-cart-x display-1 text-pedidos-light"></i>
                  </div>
                  <h4 className="text-pedidos-white mb-3">No tienes pedidos aún</h4>
                  <p className="text-pedidos-light mb-4">
                    ¡Es el momento perfecto para hacer tu primera compra! 
                    Explora nuestro catálogo y encuentra productos increíbles.
                  </p>
                  <div className="d-flex gap-3 justify-content-center flex-wrap">
                    <a href="/productos" className="btn btn-pedidos-primary btn-lg">
                      <i className="bi bi-shop me-2"></i>
                      Explorar Productos
                    </a>
                    <a href="/eventos" className="btn btn-pedidos-success btn-lg">
                      <i className="bi bi-calendar-event me-2"></i>
                      Ver Eventos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
      ) : (
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-pedidos-white mb-0">
                  <i className="bi bi-list-ul me-2 text-pedidos-primary"></i>
                  Historial de Pedidos ({pedidos.length})
                </h5>
                <div className="dropdown">
                  <button 
                    className="btn btn-pedidos-primary btn-sm dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-filter me-1"></i>
                    Filtrar
                  </button>
                  <ul className="dropdown-menu dropdown-menu-pedidos">
                    <li><a className="dropdown-item" href="#">Todos los pedidos</a></li>
                    <li><a className="dropdown-item" href="#">En preparación</a></li>
                    <li><a className="dropdown-item" href="#">Entregados</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">Más recientes</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="row">
                {pedidos
                  .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()) // Ordenar por fecha más reciente
                  .map(p => (
                    <div key={p.id} className="col-12 mb-3 fade-in-up">
                      <OrderCard pedido={p} isAdmin={false} />
                    </div>
                  ))
                }
              </div>

              {/* Footer con acciones adicionales */}
              <div className="text-center mt-4">
                <div className="orders-filters card shadow-sm">
                  <div className="card-body">
                    <h6 className="text-pedidos-white mb-3">¿Necesitas ayuda con tu pedido?</h6>
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
                      <a href="/contact" className="btn btn-pedidos-primary btn-sm">
                        <i className="bi bi-headset me-1"></i>
                        Contacto
                      </a>
                      <a href="/productos" className="btn btn-pedidos-success btn-sm">
                        <i className="bi bi-plus-circle me-1"></i>
                        Hacer Nuevo Pedido
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}
      </div>
    </div>
  );
};

export default OrdersPage;

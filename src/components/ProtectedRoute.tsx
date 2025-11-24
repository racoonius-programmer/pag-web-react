import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUsuarioActual } from '../hooks/UseUsuarioActual';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Componente que protege rutas requiriendo autenticación y opcionalmente rol de admin
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { usuario, loading } = useUsuarioActual();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="text-white mt-2">Verificando permisos...</div>
        </div>
      </div>
    );
  }

  // Si no hay usuario logueado, redirigir al inicio
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere admin pero el usuario no es admin, redirigir al inicio
  if (requireAdmin && usuario.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;
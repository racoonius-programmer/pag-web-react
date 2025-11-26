// src/hooks/useAdminRoute.ts

import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

/**
 * Hook personalizado para detectar si el usuario está en una ruta de administración
 * @returns boolean - true si está en una ruta /admin*
 */
export const useAdminRoute = (): boolean => {
  const location = useLocation();
  
  return useMemo(() => {
    return location.pathname.startsWith('/admin');
  }, [location.pathname]);
};

/**
 * Hook personalizado para obtener información detallada sobre la ruta admin actual
 * @returns objeto con información de la ruta admin
 */
export const useAdminRouteInfo = () => {
  const location = useLocation();
  
  return useMemo(() => {
    const isAdminRoute = location.pathname.startsWith('/admin');
    const adminSection = isAdminRoute 
      ? location.pathname.split('/')[2] || 'dashboard'
      : null;
    
    return {
      isAdminRoute,
      adminSection,
      fullPath: location.pathname,
      isMainAdmin: location.pathname === '/admin',
      isDashboard: location.pathname === '/admin' || location.pathname === '/admin/',
      isUsers: adminSection === 'users',
      isProducts: adminSection === 'products',
      isOrders: adminSection === 'orders'
    };
  }, [location.pathname]);
};
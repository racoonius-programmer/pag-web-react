import React from 'react';

interface StickyContainerProps {
  children: React.ReactNode;
  className?: string;
  forceSticky?: boolean;
}

/**
 * Componente contenedor que aplica comportamiento sticky
 * Útil para dashboards y paneles que necesiten mantenerse fijos en pantalla
 * Detecta automáticamente si está en el admin para evitar conflictos de layout
 */
const StickyContainer: React.FC<StickyContainerProps> = ({ 
  children, 
  className = '', 
  forceSticky = false 
}) => {
  // Detectar si estamos en el admin basándonos en la URL
  const isInAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  
  // En el admin, usar contenedor normal sin sticky para evitar conflictos con el sidebar sticky
  // Fuera del admin, usar sticky normal
  const containerClass = isInAdmin && !forceSticky 
    ? `admin-content-container ${className}` 
    : `sticky-dashboard-container ${className}`;
  
  return (
    <div className={containerClass}>
      {children}
    </div>
  );
};

export default StickyContainer;
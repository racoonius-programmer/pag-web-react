// src/hooks/useReactiveUser.ts
// Hook más robusto para manejar el estado del usuario con reactividad garantizada

import { useState, useEffect, useCallback } from 'react';
import { getSessionItem } from './useSessionStorage';
import type { UsuarioSesion } from '../types/User';

/**
 * Hook personalizado para manejar el estado del usuario con reactividad garantizada
 * Escucha múltiples eventos para asegurar que el componente se actualice
 */
export const useReactiveUser = () => {
  const [usuarioActual, setUsuarioActual] = useState<UsuarioSesion | null>(() => {
    try {
      const raw = getSessionItem('usuarioActual');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Función para forzar actualización
  const forceUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  // Función para actualizar usuario
  const updateUser = useCallback((newUser: UsuarioSesion | null) => {
    setUsuarioActual(newUser);
    forceUpdate();
  }, [forceUpdate]);

  // Función para logout
  const logout = useCallback(() => {
    setUsuarioActual(null);
    forceUpdate();
  }, [forceUpdate]);

  // Efecto para sincronizar con sessionStorage
  useEffect(() => {
    const syncWithStorage = () => {
      try {
        const raw = getSessionItem('usuarioActual');
        const newUser = raw ? JSON.parse(raw) : null;
        
        // Solo actualizar si es diferente
        if (JSON.stringify(newUser) !== JSON.stringify(usuarioActual)) {
          setUsuarioActual(newUser);
        }
      } catch {
        setUsuarioActual(null);
      }
    };

    // Sincronizar inmediatamente
    syncWithStorage();

    // Escuchar eventos
    const handleUserLogout = () => {
      logout();
    };

    const handleSessionUpdate = (e: CustomEvent) => {
      if (e.detail.key === 'usuarioActual') {
        try {
          if (e.detail.value === null || e.detail.value === undefined) {
            logout();
          } else {
            const newUser = JSON.parse(e.detail.value);
            updateUser(newUser);
          }
        } catch {
          logout();
        }
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'levelup_logout_event') {
        logout();
      } else if (e.key === 'sync_usuarioActual') {
        syncWithStorage();
      }
    };

    // Intervalo de verificación cada 5 segundos (como fallback ligero)
    const interval = setInterval(syncWithStorage, 5000);

    // Agregar listeners
    window.addEventListener('userLogout', handleUserLogout);
    window.addEventListener('sessionUpdate', handleSessionUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('userLogout', handleUserLogout);
      window.removeEventListener('sessionUpdate', handleSessionUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [usuarioActual, logout, updateUser]);

  return {
    usuarioActual,
    updateUser,
    logout,
    forceUpdate,
    updateTrigger // Para usar en dependencias de useMemo/useEffect
  };
};
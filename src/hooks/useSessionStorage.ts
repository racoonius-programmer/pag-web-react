/*
  Nota de cambios:
  - Archivo creado para encapsular acceso a `sessionStorage`.
  - Provee helpers: `getSessionItem`, `setSessionItem`, `removeSessionItem` y
    el hook reactivo `useSessionStorageState`.
  - Añadido: sincronización entre pestañas para logout y redirección automática
    desde páginas admin cuando se cierra sesión en otra pestaña.
  - Motivo: centralizar lectura/escritura de la sesión (clave `usuarioActual`)
    para que la sesión se mantenga solo durante la sesión del navegador
    (se borra al cerrar la pestaña/ventana).
  - Uso: importar los helpers desde `../hooks/useSessionStorage`.
*/

import { useState, useEffect } from 'react';

// Clave personalizada para eventos de logout entre pestañas
const LOGOUT_EVENT_KEY = 'levelup_logout_event';

// Utilidades simples para sessionStorage
export function getSessionItem(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setSessionItem(key: string, value: any): void {
  try {
    const v = typeof value === 'string' ? value : JSON.stringify(value);
    sessionStorage.setItem(key, v);
    
    // También guardar en localStorage para sincronización entre pestañas
    if (key === 'usuarioActual') {
      localStorage.setItem('sync_' + key, v);
      
      // Disparar evento personalizado para notificar a otras pestañas
      window.dispatchEvent(new CustomEvent('sessionUpdate', { 
        detail: { key, value: v } 
      }));
    }
  } catch {
    // noop
  }
}

export function removeSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
    
    // Si se está removiendo la sesión del usuario, notificar logout a todas las pestañas
    if (key === 'usuarioActual') {
      // Remover también del localStorage de sincronización
      localStorage.removeItem('sync_' + key);
      
      // Disparar evento de actualización de sesión para la pestaña actual
      window.dispatchEvent(new CustomEvent('sessionUpdate', { 
        detail: { key, value: null } 
      }));
      
      // Usar localStorage temporalmente para comunicación entre pestañas
      localStorage.setItem(LOGOUT_EVENT_KEY, Date.now().toString());
      localStorage.removeItem(LOGOUT_EVENT_KEY);
      
      // También disparar evento de logout en la pestaña actual
      window.dispatchEvent(new CustomEvent('userLogout'));
    }
  } catch {
    // noop
  }
}

/**
 * Hook para manejar logout automático desde páginas admin
 * cuando se cierra sesión en otra pestaña
 */
export function useLogoutHandler() {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Detectar cuando se dispara el evento de logout desde otra pestaña
      if (e.key === LOGOUT_EVENT_KEY) {
        // Verificar si estamos en una página de admin
        const isInAdminPage = window.location.pathname.startsWith('/admin');
        
        if (isInAdminPage) {
          // Redireccionar a inicio inmediatamente
          window.location.href = '/main';
        } else {
          // En las demás páginas, forzar recarga para actualizar el estado
          window.location.reload();
        }
      }
    };

    const handleCustomLogout = () => {
      // Manejar logout en la pestaña actual
      const isInAdminPage = window.location.pathname.startsWith('/admin');
      
      if (isInAdminPage) {
        window.location.href = '/main';
      }
    };

    const handleBeforeUnload = () => {
      // Limpiar localStorage de sincronización al cerrar pestañas
      try {
        const usuarioActual = sessionStorage.getItem('usuarioActual');
        if (usuarioActual) {
          setTimeout(() => {
            const stillHasSyncData = localStorage.getItem('sync_usuarioActual');
            if (stillHasSyncData && !sessionStorage.getItem('usuarioActual')) {
              localStorage.removeItem('sync_usuarioActual');
            }
          }, 100);
        }
      } catch {
        // noop
      }
    };

    // Escuchar cambios en localStorage (comunicación entre pestañas)
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar evento personalizado de logout en la pestaña actual
    window.addEventListener('userLogout', handleCustomLogout);
    
    // Limpiar datos de sincronización al cerrar la pestaña
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogout', handleCustomLogout);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}

// Hook reactivo opcional: mantiene un estado sincronizado con sessionStorage
// y sincroniza entre pestañas usando localStorage como puente
export function useSessionStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      // Primero intentar leer de sessionStorage
      let raw = sessionStorage.getItem(key);
      
      // Si no hay en sessionStorage pero sí en localStorage (nueva pestaña)
      if (!raw && key === 'usuarioActual') {
        const syncRaw = localStorage.getItem('sync_' + key);
        if (syncRaw) {
          // Copiar de localStorage a sessionStorage para esta pestaña
          sessionStorage.setItem(key, syncRaw);
          raw = syncRaw;
        }
      }
      
      return raw ? JSON.parse(raw) as T : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (state === undefined || state === null) {
        sessionStorage.removeItem(key);
        if (key === 'usuarioActual') {
          localStorage.removeItem('sync_' + key);
        }
      } else {
        sessionStorage.setItem(key, JSON.stringify(state));
        if (key === 'usuarioActual') {
          localStorage.setItem('sync_' + key, JSON.stringify(state));
        }
      }
    } catch {
      // noop
    }
  }, [key, state]);

  // Sincronizar con cambios desde otras pestañas o dentro de la misma pestaña
  useEffect(() => {
    const handleSessionUpdate = (e: CustomEvent) => {
      if (e.detail.key === key) {
        try {
          if (e.detail.value === null || e.detail.value === undefined) {
            setState(initialValue);
          } else {
            const newValue = JSON.parse(e.detail.value) as T;
            setState(newValue);
          }
        } catch {
          setState(initialValue);
        }
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      // Detectar logout desde otra pestaña
      if (e.key === LOGOUT_EVENT_KEY && key === 'usuarioActual') {
        setState(initialValue);
        return;
      }
      
      // Sincronizar cambios de usuarioActual desde otras pestañas
      if (e.key === 'sync_' + key && key === 'usuarioActual') {
        try {
          if (e.newValue) {
            const newValue = JSON.parse(e.newValue) as T;
            sessionStorage.setItem(key, e.newValue);
            setState(newValue);
          } else {
            sessionStorage.removeItem(key);
            setState(initialValue);
          }
        } catch {
          setState(initialValue);
        }
      }
    };

    // Verificar si hay cambios en localStorage al montar el componente
    const checkSync = () => {
      if (key === 'usuarioActual') {
        try {
          const syncValue = localStorage.getItem('sync_' + key);
          const sessionValue = sessionStorage.getItem(key);
          
          // Si localStorage tiene un valor pero sessionStorage no
          if (syncValue && !sessionValue) {
            sessionStorage.setItem(key, syncValue);
            setState(JSON.parse(syncValue) as T);
          }
        } catch {
          // noop
        }
      }
    };

    // Verificar sincronización al montar
    checkSync();

    window.addEventListener('sessionUpdate', handleSessionUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('sessionUpdate', handleSessionUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [state, setState] as const;
}

/*
  Nota de cambios:
  - Archivo creado para encapsular acceso a `sessionStorage`.
  - Provee helpers: `getSessionItem`, `setSessionItem`, `removeSessionItem` y
    el hook reactivo `useSessionStorageState`.
  - Motivo: centralizar lectura/escritura de la sesión (clave `usuarioActual`)
    para que la sesión se mantenga solo durante la sesión del navegador
    (se borra al cerrar la pestaña/ventana).
  - Uso: importar los helpers desde `../hooks/useSessionStorage`.
*/

import { useState, useEffect } from 'react';

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
  } catch {
    // noop
  }
}

export function removeSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // noop
  }
}

// Hook reactivo opcional: mantiene un estado sincronizado con sessionStorage
export function useSessionStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) as T : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (state === undefined || state === null) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // noop
    }
  }, [key, state]);

  return [state, setState] as const;
}

// src/hooks/useModal.ts
import { useState, useCallback } from 'react';

// Define la estructura del estado que necesita el componente GlobalModal.
export interface ModalState {
  show: boolean;
  title: string;
  message: string;
  onHiddenCallback?: (() => void) | undefined; // Función a ejecutar después de cerrar
}

/**
 * Custom Hook para gestionar el estado de un modal global.
 */
export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    show: false,
    title: 'Mensaje',
    message: '',
    onHiddenCallback: undefined,
  });

  // Muestra el modal y guarda el callback que se ejecutará cuando el modal esté completamente oculto
  const showModal = useCallback((
    message: string,
    title: string = "Mensaje",
    onHiddenCallback?: () => void
  ) => {
    setModalState({ show: true, title, message, onHiddenCallback });
  }, []);

  // Oculta el modal (no ejecuta el callback; el callback se ejecuta desde el componente Modal al recibir hidden.bs.modal)
  const handleClose = useCallback(() => {
    setModalState(prev => ({ ...prev, show: false }));
  }, []);

  return { modalState, showModal, handleClose };
}
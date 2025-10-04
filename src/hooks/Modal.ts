// src/hooks/useModal.ts
import { useState, useCallback } from 'react';

// Define la estructura del estado que necesita el componente GlobalModal.
export interface ModalState {
  show: boolean;
  title: string;
  message: string;
  onHiddenCallback: (() => void) | undefined; // Función a ejecutar después de cerrar
}

/**
 * Custom Hook para gestionar el estado de un modal global (reemplaza mostrarModal).
 */
export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    show: false,
    title: 'Mensaje',
    message: '',
    onHiddenCallback: undefined,
  });

  /**
   * Reemplaza la función original mostrarModal(mensaje, titulo, callback).
   */
  const showModal = useCallback((
    message: string,
    title: string = "Mensaje",
    callback: (() => void) | null = null // El callback ahora se convierte en onHiddenCallback
  ) => {
    setModalState({
      show: true,
      title,
      message,
      onHiddenCallback: callback || undefined, // undefined si es null
    });
  }, []);

  /**
   * Función que el componente GlobalModal llama para actualizar el estado a "cerrado"
   * después de que Bootstrap finaliza la animación de cierre.
   */
  const handleClose = useCallback(() => {
    setModalState(prev => ({
        ...prev,
        show: false, // Solo actualizamos show a false
        // title y message se mantienen hasta la próxima apertura
        onHiddenCallback: undefined, // Limpiamos el callback por seguridad
    }));
  }, []);

  return {
    modalState,
    showModal, // Función principal para disparar el modal
    handleClose, // Función para ser pasada como prop 'onClose' al GlobalModal
  };
}
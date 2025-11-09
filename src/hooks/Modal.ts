// src/hooks/useModal.ts
// Explicación:
// - ¿Qué hace este hook? Centraliza el estado de un "modal global" que puede abrirse
//   desde cualquier parte de la app. Devuelve `modalState` (datos del modal),
//   `showModal(...)` para abrirlo y `handleClose()` para cerrarlo.
// - ¿Por qué usar un hook así? Para no tener múltiples modales o estados repartidos,
//   y poder controlarlo desde páginas o hooks (por ejemplo, mostrar mensajes al usuario).

import { useState, useCallback } from 'react';

// Estructura del estado que el modal necesita.
// - show: si el modal está visible
// - title/message: contenido mostrado
// - onHiddenCallback: función opcional que se ejecuta después de que el modal haya terminado
//   su animación de ocultado. 
// Nota: la ejecución real del callback la hace el componente 
// `src/components/Modal.tsx` cuando recibe el evento `hidden.bs.modal` de Bootstrap.

export interface ModalState {
  show: boolean;
  title: string;
  message: string;
  onHiddenCallback?: (() => void) | undefined; // Función a ejecutar después de cerrar
}

/**
 * useModal
 * - Hook personalizado que gestiona el estado del modal global.
 * - Devuelve:
 *    modalState: { show, title, message, onHiddenCallback }
 *    showModal(message, title?, onHiddenCallback?): abre el modal con esos datos
 *    handleClose(): cierra el modal (no ejecuta el onHiddenCallback directamente)
 */

export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    show: false,
    title: 'Mensaje',
    message: '',
    onHiddenCallback: undefined,
  });

  // showModal: abre el modal y guarda el callback opcional que debe ejecutarse
  // cuando el modal esté completamente oculto (después de la animación).
  const showModal = useCallback((
    message: string,
    title: string = "Mensaje",
    onHiddenCallback?: () => void
  ) => {
    setModalState({ show: true, title, message, onHiddenCallback });
  }, []);

  // handleClose: cambia `show` a false para pedir al modal que se oculte.
  // El callback `onHiddenCallback` NO se ejecuta aquí porque se espera a que
  // el componente visual confirme que ya terminó la animación (evento hidden.bs.modal).
  const handleClose = useCallback(() => {
    setModalState(prev => ({ ...prev, show: false }));
  }, []);

  return { modalState, showModal, handleClose };
}

/*
  Dónde se usa este hook `useModal` en el proyecto y por qué:
  - src/pages/User_Register.tsx
    * Se crea `const modal = useModal()` y se pasa la información al `GlobalModal`.
    * Razón: al registrar un usuario se muestra un modal con mensaje/confirmación.

  - src/pages/UserPerfil.tsx
    * Similar: usar el hook para mostrar mensajes o confirmaciones desde el perfil.

  - src/pages/admin/Admin_Products.tsx
    * En el panel admin se usa para abrir el `ProductFormModal` o mostrar confirmaciones al crear/editar productos.

  - src/hooks/RegistroForms.ts
    * Algunos hooks auxiliares importan `useModal` para centralizar la lógica de mostrar mensajes.

  Nota: `src/components/Modal.tsx` es el componente visual que escucha `modalState` y
  muestra/oculta el modal en pantalla; el hook solo gestiona el estado.
*/
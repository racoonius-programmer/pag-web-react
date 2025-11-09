// src/components/Modal.tsx (Versión con tema oscuro)

// Import principal de React y hooks usados en este componente:
// - React: necesario para JSX (en proyectos TSX/React normalmente es automático durante la compilación,
//   pero mantener la importación es útil para tipado y compatibilidad).
// - useEffect: hook para efectos secundarios (montaje, actualización, limpieza). Aquí lo usamos para
//   inicializar/limpiar la instancia de Bootstrap y para sincronizar la prop `show`.
// - useRef: hook para mantener referencias mutables entre renders; se usa para apuntar al nodo DOM
//   del modal y para guardar la instancia JS de Bootstrap sin provocar re-renders.

import React, { useEffect, useRef } from 'react';

// Props que recibe el modal global
interface GlobalModalProps {
  // show: controla si el modal debe mostrarse (prop controlada desde el padre)
  show: boolean;

  // title/message: contenido mostrado en el modal
  title: string;
  message: string;

  // onClose: callback para ejecutar cuando el usuario cierra el modal (click en botones)
  onClose: () => void;

  // onHiddenCallback: callback opcional que se ejecuta cuando Bootstrap termina de ocultar el modal
  onHiddenCallback?: () => void;
}

// Asegúrate de que bootstrap esté disponible globalmente (lo importas en main.tsx)
// `bootstrap` viene de la librería global de Bootstrap (asegúrate de importarla en main.tsx)
declare var bootstrap: any;

const Modal: React.FC<GlobalModalProps> = ({
  show,
  title,
  message,
  onClose,
  onHiddenCallback,
}) => {
  // Referencia al elemento DOM del modal
  const modalRef = useRef<HTMLDivElement | null>(null);
  // Referencia a la instancia JS de Bootstrap Modal (para llamar show/hide/dispose)
  const modalInstanceRef = useRef<any>(null);
  // Guardamos el callback onHidden en una ref para que el listener use la versión más reciente
  const onHiddenRef = useRef(onHiddenCallback);

  // Mantener la referencia del callback actualizada (evita re-registrar listeners)
  useEffect(() => {
    onHiddenRef.current = onHiddenCallback;
  }, [onHiddenCallback]);


  // Inicializar la instancia de Bootstrap Modal y el listener `hidden.bs.modal`.
  // Se hace una sola vez al montar el componente.
  useEffect(() => {
    if (!modalRef.current) return;
    if (!modalInstanceRef.current && typeof bootstrap !== 'undefined') {
      // Crear la instancia JS de Bootstrap (backdrop: 'static' evita cerrar al click en fondo)
      modalInstanceRef.current = new bootstrap.Modal(modalRef.current, { backdrop: 'static' });

      // Listener: cuando Bootstrap termina de ocultar el modal, ejecutamos el callback opcional
      modalRef.current.addEventListener('hidden.bs.modal', () => {
        if (onHiddenRef.current) {
          try { onHiddenRef.current(); } catch (e) { console.error(e); }
        }
      });
    }

    // Cleanup: al desmontar liberamos la instancia para evitar fugas de memoria
    return () => {
      if (modalInstanceRef.current) {
        modalInstanceRef.current.dispose();
        modalInstanceRef.current = null;
      }
    };
  }, []);


  // Sincroniza la prop `show` con la instancia de Bootstrap (mostrar/ocultar)
  useEffect(() => {
    if (!modalInstanceRef.current) return;
    if (show) modalInstanceRef.current.show();
    else modalInstanceRef.current.hide();
  }, [show]);

  return (
    // Estructura DOM del modal (Bootstrap):
    // - `ref={modalRef}` es necesario para que la instancia JS de Bootstrap lo controle.
    // - `data-bs-theme="dark"` aplica tema oscuro a componentes bootstrap (si está soportado).
    <div className="modal fade" tabIndex={-1} ref={modalRef} aria-labelledby="modalTitle" aria-hidden="true" data-bs-theme="dark">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-light border-secondary">
          <div className="modal-header border-secondary">
            {/* Título accesible */}
            <h5 id="modalTitle" className="modal-title text-light">{title}</h5>
            {/* Botón de cierre: llama a onClose (padre decide qué hacer) */}
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Mensaje principal del modal */}
            <p className="text-light mb-0">{message}</p>
          </div>
          <div className="modal-footer border-secondary">
            {/* Botones que cierran el modal (delegan en onClose) */}
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

/*
  Archivos que llaman a este componente Modal (uso en el proyecto):
  - src/pages/User_Register.tsx
    Usa un hook `useModal` y renderiza <GlobalModal ... /> pasando
    props: show, title, message, onClose, onHiddenCallback.

  - src/pages/User_Login.tsx
    Importa y muestra el modal para confirmar/mostrar mensajes desde el login.

  - src/pages/UserPerfil.tsx
    Importa y usa el modal para confirmaciones o avisos desde el perfil de usuario.

  Nota: también hay un hook `useModal` en `src/hooks/Modal` que centraliza
  la lógica de estado del modal (mostrar/ocultar, titulo, mensaje, callbacks)
  y es la forma recomendada de abrir este modal desde páginas y componentes.
*/
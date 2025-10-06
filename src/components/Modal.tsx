// src/components/Modal.tsx (Versión Final Corregida)

import React, { useEffect, useRef } from 'react';

interface GlobalModalProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onHiddenCallback?: () => void;
}

// Asegúrate de que bootstrap esté disponible globalmente (lo importas en main.tsx)
declare var bootstrap: any;

const Modal: React.FC<GlobalModalProps> = ({
  show,
  title,
  message,
  onClose,
  onHiddenCallback,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalInstanceRef = useRef<any>(null);
  const onHiddenRef = useRef(onHiddenCallback);

  // Mantener la referencia del callback actualizada
  useEffect(() => {
    onHiddenRef.current = onHiddenCallback;
  }, [onHiddenCallback]);

  // Inicializar instancia de Bootstrap y listener hidden.bs.modal (una sola vez)
  useEffect(() => {
    if (!modalRef.current) return;
    if (!modalInstanceRef.current && typeof bootstrap !== 'undefined') {
      modalInstanceRef.current = new bootstrap.Modal(modalRef.current, { backdrop: 'static' });

      // Cuando Bootstrap haya ocultado el modal, ejecutar el callback guardado
      modalRef.current.addEventListener('hidden.bs.modal', () => {
        // primero llamar onClose (si necesitas sincronizar estado)
        // NOTA: no llamamos onClose aquí porque onClose normalmente ya oculta el modal.
        // Ejecutar el callback de after-close
        if (onHiddenRef.current) {
          try { onHiddenRef.current(); } catch (e) { console.error(e); }
        }
      });
    }
    // cleanup (al desmontar) eliminamos instancia
    return () => {
      if (modalInstanceRef.current) {
        modalInstanceRef.current.dispose();
        modalInstanceRef.current = null;
      }
    };
  }, []);

  // Sincronizar show prop con la instancia de Bootstrap
  useEffect(() => {
    if (!modalInstanceRef.current) return;
    if (show) modalInstanceRef.current.show();
    else modalInstanceRef.current.hide();
  }, [show]);

  return (
    <div className="modal fade" tabIndex={-1} ref={modalRef} aria-labelledby="modalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="modalTitle" className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose} // cerrar el modal; la redirección se ejecutará en hidden.bs.modal desde arriba
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
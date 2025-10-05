import React, { useEffect, useRef } from 'react';

interface GlobalModalProps {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onHiddenCallback?: () => void;
}

// Bootstrap debe estar importado en main.tsx
declare var bootstrap: any;

const GlobalModal: React.FC<GlobalModalProps> = ({
  show,
  title,
  message,
  onClose,
  onHiddenCallback,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInstanceRef = useRef<any>(null);

  // Inicializa el modal de Bootstrap solo una vez
  useEffect(() => {
    if (modalRef.current && !modalInstanceRef.current) {
      modalInstanceRef.current = new bootstrap.Modal(modalRef.current, {
        backdrop: 'static',
      });
      modalRef.current.addEventListener('hidden.bs.modal', () => {
        onClose();
        if (onHiddenCallback) onHiddenCallback();
      });
    }
  }, [onClose, onHiddenCallback]);

  // Sincroniza el estado de show
  useEffect(() => {
    if (modalInstanceRef.current) {
      if (show) {
        modalInstanceRef.current.show();
      } else {
        modalInstanceRef.current.hide();
      }
    }
  }, [show]);

  return (
    <div
      className="modal fade"
      tabIndex={-1}
      ref={modalRef}
      aria-labelledby="modalTitle"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalTitle">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalModal;


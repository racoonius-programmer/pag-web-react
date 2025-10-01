// src/components/GlobalModal.tsx
import React, { useEffect, useRef } from 'react';
// Debes asegurarte de que la librería Bootstrap JS esté disponible en tu proyecto
// Aunque no lo importamos directamente aquí, debe ser accesible por el navegador
// si queremos usar new bootstrap.Modal().

// Define las props para el componente
interface GlobalModalProps {
    show: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onHiddenCallback?: () => void; // Para la redirección después de cerrar
}

// Declaramos la clase Modal de Bootstrap globalmente para TypeScript
declare var bootstrap: any; 

const GlobalModal: React.FC<GlobalModalProps> = ({ show, title, message, onClose, onHiddenCallback }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalInstanceRef = useRef<any>(null);

    // Efecto para inicializar el modal de Bootstrap y manejar su ciclo de vida
    useEffect(() => {
        if (!modalRef.current) return;

        // 1. Inicializar el objeto Modal de Bootstrap solo una vez
        if (!modalInstanceRef.current && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            modalInstanceRef.current = new bootstrap.Modal(modalRef.current);
        }

        const modalElement = modalRef.current;
        
        // Función para ejecutar el callback y el cierre de estado de React
        const handleHidden = () => {
            if (onHiddenCallback) {
                onHiddenCallback();
            }
            // Limpia el listener para evitar múltiples ejecuciones
            modalElement.removeEventListener('hidden.bs.modal', handleHidden);
            onClose(); // Cambia el estado de React para que 'show' sea false
        };

        if (show) {
            // Añade el listener ANTES de mostrarlo
            modalElement.addEventListener('hidden.bs.modal', handleHidden);
            modalInstanceRef.current?.show();
        } else {
            // Si el estado de React es 'false', oculta el modal si está visible
            if (modalInstanceRef.current?._isShown) {
                modalInstanceRef.current?.hide();
            }
        }

        // Cleanup: Se ejecuta cuando el componente se desmonta o antes de que el efecto se vuelva a ejecutar
        return () => {
             modalElement.removeEventListener('hidden.bs.modal', handleHidden);
        };
    }, [show, onHiddenCallback, onClose]); // Dependencias del hook

    // Nota: El CSS personalizado debe estar en un archivo CSS global o módulo CSS
    return (
        <div className="modal fade" id="generalModal" ref={modalRef} tabIndex={-1} aria-labelledby="modalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content modal-content-dark">
                    <div className="modal-header">
                        <h5 className="modal-title text-light" id="modalTitle">{title}</h5>
                        <button type="button" className="btn-close btn-close-white btn-close-modal" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body text-light" id="modalBody">
                        {message}
                    </div>
                    <div className="modal-footer border-top-0">
                        <button type="button" className="btn btn-secondary btn-close-modal" data-bs-dismiss="modal">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalModal;
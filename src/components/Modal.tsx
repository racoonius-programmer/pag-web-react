import React, { useEffect, useRef } from 'react';
// Asegúrate de que la librería Bootstrap JS esté disponible globalmente
// (usualmente a través de una importación en tu archivo principal o index.html).

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

    // 1. Efecto de Inicialización y Listeners (Se ejecuta solo al montar)
    // Este useEffect se encarga de crear la instancia de Bootstrap y añadir el listener de cierre.
    useEffect(() => {
        if (!modalRef.current) return;

        const modalElement = modalRef.current;
        
        // Inicializar el objeto Modal de Bootstrap solo una vez
        if (!modalInstanceRef.current && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            modalInstanceRef.current = new bootstrap.Modal(modalElement);
        }
        
        // Función que se ejecuta cuando Bootstrap OCULTA el modal
        const handleHidden = () => {
            // 🚨 1. Ejecuta el callback (donde está el navigate)
            if (onHiddenCallback) {
                onHiddenCallback(); 
            }
            // 🚨 2. Actualiza el estado de React en el componente padre (show: false)
            onClose(); 
        };

        // Añadir el listener permanente al evento 'hidden.bs.modal'
        // NOTA: Usamos los callbacks de las props para asegurar que siempre usamos la versión más reciente.
        modalElement.addEventListener('hidden.bs.modal', handleHidden);

        // Cleanup: Elimina el listener y destruye la instancia al desmontar
        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleHidden);
            modalInstanceRef.current?.dispose(); // Destruir la instancia de Bootstrap
        };
        // Dependencias: Solo los callbacks que pueden cambiar
    }, [onHiddenCallback, onClose]); 

    // 2. Efecto de Sincronización (Se ejecuta solo cuando la prop 'show' cambia)
    // Este useEffect se encarga de mostrar u ocultar el modal cuando la prop 'show' de React cambia.
    useEffect(() => {
        if (!modalInstanceRef.current) return;
        
        if (show) {
            // Si React dice "mostrar", Bootstrap lo muestra.
            modalInstanceRef.current.show();
        } else {
            // Si React dice "ocultar", forzamos a Bootstrap a ocultarlo.
            // Esto evita problemas si el modal ya se cerró por el listener.
            if (modalInstanceRef.current._isShown) {
                modalInstanceRef.current.hide();
            }
        }
    }, [show]); 

    return (
        <div 
            className="modal fade" 
            id="generalModal" 
            ref={modalRef} 
            tabIndex={-1} 
            aria-labelledby="modalTitle" 
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content modal-content-dark">
                    <div className="modal-header">
                        <h5 className="modal-title text-light" id="modalTitle">{title}</h5>
                        {/* El botón usa data-bs-dismiss="modal" para que Bootstrap lo cierre, lo que dispara 'hidden.bs.modal' */}
                        <button 
                            type="button" 
                            className="btn-close btn-close-white btn-close-modal" 
                            data-bs-dismiss="modal" 
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body text-light" id="modalBody">
                        {message}
                    </div>
                    <div className="modal-footer border-top-0">
                        <button 
                            type="button" 
                            className="btn btn-secondary btn-close-modal" 
                            data-bs-dismiss="modal"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalModal;
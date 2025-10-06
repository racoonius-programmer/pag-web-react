// src/components/Modal.tsx (Versión Final Corregida)

import React, { useEffect, useRef } from 'react';

interface GlobalModalProps {
    show: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onHiddenCallback?: () => void; // El callback que ejecuta la redirección (navigate)
}

// Asegúrate de que esta declaración esté disponible
declare var bootstrap: any;

const Modal: React.FC<GlobalModalProps> = ({
    show,
    title,
    message,
    onClose,
    onHiddenCallback,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalInstanceRef = useRef<any>(null);
    
    // 💡 Referencia para guardar la función de redirección más reciente (CRUCIAL para evitar errores)
    const onHiddenCallbackRef = useRef(onHiddenCallback);

    // 1. Sincroniza la Referencia del Callback (se ejecuta con cada render donde cambie el callback)
    useEffect(() => {
        onHiddenCallbackRef.current = onHiddenCallback;
    }, [onHiddenCallback]);

    // 2. Inicialización de Bootstrap y adjuntar listener (SOLO UNA VEZ)
    useEffect(() => {
        const modalElement = modalRef.current;
        if (!modalElement || modalInstanceRef.current) return;

        // Crear instancia de Bootstrap
        try {
            modalInstanceRef.current = new bootstrap.Modal(modalElement, {
                backdrop: 'static',
            });
        } catch (e) {
            console.error("Error al inicializar bootstrap.Modal. Asegúrate de que 'bootstrap.bundle.min.js' se haya cargado antes.", e);
            return;
        }
        
        // Listener que se dispara cuando la animación de cierre termina.
        const handleHidden = () => {
            onClose(); // Llama a onClose para sincronizar el estado de React (show: false)
            
            // 🚀 EJECUCIÓN SEGURA: Llama al callback guardado en la referencia
            if (onHiddenCallbackRef.current) {
                onHiddenCallbackRef.current();
            }
        };

        // Adjunta el listener
        modalElement.addEventListener('hidden.bs.modal', handleHidden);

        // Limpieza: Desadjunta el listener al desmontar
        return () => {
            modalElement.removeEventListener('hidden.bs.modal', handleHidden);
            // No hacemos dispose aquí para evitar problemas de ciclo de vida con React
        };
    }, [onClose]); 

    // 3. Sincronización del estado de 'show' (Muestra u oculta el modal)
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
                        {/* El onClose del botón también inicia la animación de cierre */}
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
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

export default Modal;
// src/pages/UserRegister.tsx

import React, { useState } from 'react';
import { useRegistroForm, type RegistroFormData } from '../hooks/RegistroForms'; 
import { useRegionesComunas } from '../hooks/RegionesComunas';
import { useModal } from '../hooks/Modal';
import GlobalModal from '../components/Modal';
import RegionComunaSelects from '../components/RegionComunaSelects';
import { InputWithValidation, PasswordInput } from '../components/InputsRegistro';

// ----------------------------------------------------------------------
// COMPONENTE DE REGISTRO
// ----------------------------------------------------------------------

const UserRegister: React.FC = () => {
    // 1. Inicializar Hooks
    const modal = useModal();

    // 2. Hook para Regiones y Comunas
    const {
        selectedRegion,
        selectedComuna,
        handleRegionChange,
        handleComunaChange,
    } = useRegionesComunas();
    
    // 3. Hook para el Formulario (que usa las selecciones de región/comuna)
    const { 
        formData, 
        validationMessages, 
        isFormTouched,
        handleChange, 
        handleSubmit 
    } = useRegistroForm(selectedRegion, selectedComuna, modal.showModal);

    // Estado local para visibilidad de contraseñas (se mantiene aquí, ya que es UI-específica)
    const [showPassword, setShowPassword] = useState({
        contrasena: false,
        confirmarContrasena: false, 
    });

    // Handler para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = (field: 'contrasena' | 'confirmarContrasena') => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Renderizado condicional de errores basado en el estado del hook
    const renderMessage = (fieldId: keyof RegistroFormData | 'contrasenaCoincidencia'): React.ReactNode => {
        const messageState = validationMessages[fieldId];
        if (messageState && isFormTouched) {
            return <div className={`mt-1 small ${messageState.className}`}>{messageState.message}</div>;
        }
        return null;
    };
    
    // Función para determinar si un campo debe tener el estilo 'is-invalid'
    const getValidationClass = (fieldId: keyof RegistroFormData | 'contrasenaCoincidencia'): string => {
        const messageState = validationMessages[fieldId];
        if (messageState && isFormTouched) {
            if (messageState.className === 'text-danger') return 'is-invalid';
            if (messageState.className === 'text-success') return 'is-valid';
        }
        return ''; 
    }

    return (
        <div className="container-fluid bg-dark text-white p-5 min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card bg-dark border-0 p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 className="text-center mb-4 text-light fw-bold">Registro de Usuario</h2>

                <form id="registroForm" onSubmit={handleSubmit} noValidate>

                    {/* Correo */}
                    <InputWithValidation
                        id="correo"
                        label="Correo:"
                        type="email"
                        name="correo"
                        required
                        placeholder="Introduzca su correo"
                        maxLength={100}
                        value={formData.correo}
                        onChange={handleChange}
                        validationClass={getValidationClass('correo')}
                        validationMessage={renderMessage('correo')}
                    />

                    {/* Contraseña */}
                    <PasswordInput
                        id="contrasena"
                        label="Contraseña:"
                        name="contrasena"
                        required
                        placeholder="Ingrese la contraseña"
                        maxLength={10}
                        value={formData.contrasena}
                        onChange={handleChange}
                        validationClass={getValidationClass('contrasena')}
                        validationMessage={renderMessage('contrasena')}
                        show={showPassword.contrasena}
                        onToggle={() => togglePasswordVisibility('contrasena')}
                    />

                    {/* Confirmar contraseña */}
                    <PasswordInput
                        id="confirmarContrasena"
                        label="Confirmar Contraseña:"
                        name="confirmarContrasena"
                        required
                        placeholder="Reingrese la contraseña"
                        maxLength={10}
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        validationClass={getValidationClass('confirmarContrasena')}
                        validationMessage={renderMessage('confirmarContrasena')}
                        show={showPassword.confirmarContrasena}
                        onToggle={() => togglePasswordVisibility('confirmarContrasena')}
                    />

                    {/* Nombre de usuario */}
                    <InputWithValidation
                        id="username"
                        label="Nombre de usuario:"
                        type="text"
                        name="username"
                        required
                        placeholder="Introduzca un nombre de usuario"
                        maxLength={100}
                        value={formData.username}
                        onChange={handleChange}
                        validationClass={getValidationClass('username')}
                        validationMessage={renderMessage('username')}
                    />

                    {/* Fecha de nacimiento */}
                    <InputWithValidation
                        id="fechaNacimiento"
                        label="Fecha de Nacimiento:"
                        type="date"
                        name="fechaNacimiento"
                        required
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        validationClass={getValidationClass('fechaNacimiento')}
                        validationMessage={renderMessage('fechaNacimiento')}
                    />

                    {/* Teléfono (opcional) */}
                    <InputWithValidation
                        id="telefono"
                        label="Teléfono (opcional):"
                        type="text"
                        name="telefono"
                        placeholder="Ej: 9 1234 5678"
                        maxLength={12}
                        value={formData.telefono}
                        onChange={handleChange}
                        validationClass={getValidationClass('telefono')}
                        validationMessage={renderMessage('telefono')}
                    />

                    {/* Selección de región y comuna */}
                    <RegionComunaSelects
                        currentRegion={selectedRegion}
                        currentComuna={selectedComuna}
                        onRegionChange={handleRegionChange}
                        onComunaChange={handleComunaChange}
                    />

                    {/* Dirección */}
                    <InputWithValidation
                        id="direccion"
                        label="Dirección:"
                        type="text"
                        name="direccion"
                        required
                        placeholder="Introduzca una dirección"
                        value={formData.direccion}
                        onChange={handleChange}
                        validationClass={getValidationClass('direccion')}
                        validationMessage={renderMessage('direccion')}
                    />

                    {/* Código de referido */}
                    <InputWithValidation
                        id="codigoRef"
                        label="Código referido (si posee)"
                        type="text"
                        name="codigoRef"
                        placeholder="Introduzca un código de referido"
                        maxLength={10}
                        value={(formData as any).codigoRef || ''}
                        onChange={handleChange}
                        validationClass=""
                        validationMessage={null}
                    />

                    <button type="submit" className="btn btn-primary w-100">
                        Registrarme
                    </button>

                    <p className="text-light mt-3 text-center">
                        ¿Ya tienes una cuenta?
                        <a href="/login" className="text-light text-decoration-underline">Iniciar sesión</a>.
                    </p>
                </form>

                {/* Botón de prueba para el modal */}
                <button onClick={() => modal.showModal("¡Funciona!", "Prueba")}>Probar Modal</button>
            </div>
            
            {/* Integración del GlobalModal */}
            <GlobalModal
                show={modal.modalState.show}
                title={modal.modalState.title}
                message={modal.modalState.message}
                onClose={modal.handleClose}
                onHiddenCallback={modal.modalState.onHiddenCallback}
            />
        </div>
    );
};

export default UserRegister;
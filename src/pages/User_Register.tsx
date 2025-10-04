// src/pages/UserRegister.tsx

import React, { useState, useMemo } from 'react';
// 🚨 Importación corregida de los tipos de validación
import { useRegistroForm, type RegistroFormData, type ValidationMessage } from '../hooks/RegistroForms'; 
import { useRegionesComunas } from '../hooks/RegionesComunas';
import { useModal } from '../hooks/Modal';
import GlobalModal from '../components/Modal';
import RegionComunaSelects from '../components/RegionComunaSelects';

// ----------------------------------------------------------------------
// COMPONENTE DE REGISTRO
// ----------------------------------------------------------------------

const UserRegister: React.FC = () => {
    // 1. Inicializar Hooks
    const { modalState, handleClose } = useModal();

    // 2. Hook para Regiones y Comunas
    // 🚨 AJUSTE AQUÍ: Eliminamos 'regionesOptions' y 'comunasOptions' de la desestructuración
    const {
        // regionesOptions, // Ya no se necesitan aquí, el componente las maneja internamente.
        // comunasOptions, // Ya no se necesitan aquí.
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
    } = useRegistroForm(selectedRegion, selectedComuna);

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
                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label text-light">Correo:</label>
                        <input 
                            type="email" 
                            required 
                            id="correo" 
                            className={`form-control ${getValidationClass('correo')}`}
                            name="correo" 
                            placeholder="Introduzca su correo"
                            maxLength={100}
                            value={formData.correo}
                            onChange={handleChange}
                        />
                        {renderMessage('correo')}
                    </div>


                    {/* Contraseña */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="contrasena" className="form-label text-light">Contraseña:</label>
                        <input 
                            type={showPassword.contrasena ? "text" : "password"} 
                            className={`form-control ${getValidationClass('contrasena')}`} 
                            id="contrasena" 
                            placeholder="Ingrese la contraseña" 
                            required
                            maxLength={10}
                            value={formData.contrasena}
                            onChange={handleChange}
                        />
                        <i 
                            className={`bi ${showPassword.contrasena ? "bi-eye-slash-fill" : "bi-eye-fill"} toggle-password`}
                            onClick={() => togglePasswordVisibility('contrasena')}
                            style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer', color: 'black' }}
                        ></i>
                        {renderMessage('contrasena')}
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="confirmarContrasena" className="form-label text-light">Confirmar Contraseña:</label>
                        <input 
                            type={showPassword.confirmarContrasena ? "text" : "password"} 
                            className={`form-control ${getValidationClass('confirmarContrasena')}`} 
                            id="confirmarContrasena" 
                            placeholder="Reingrese la contraseña"
                            required 
                            maxLength={10}
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                        />
                        <i 
                            className={`bi ${showPassword.confirmarContrasena ? "bi-eye-slash-fill" : "bi-eye-fill"} toggle-password`}
                            onClick={() => togglePasswordVisibility('confirmarContrasena')}
                            style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer', color: 'black' }}
                        ></i>
                        {renderMessage('confirmarContrasena')}
                    </div>

                    {/* Nombre de usuario */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-light">Nombre de usuario:</label>
                        <input 
                            type="text" 
                            required 
                            id="username" 
                            className={`form-control ${getValidationClass('username')}`}
                            name="username"
                            placeholder="Introduzca un nombre de usuario" 
                            maxLength={100}
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {renderMessage('username')}
                    </div>

                    {/* Fecha de nacimiento */}
                    <div className="mb-3">
                        <label htmlFor="fechaNacimiento" className="form-label text-light">Fecha de Nacimiento:</label>
                        <input 
                            type="date" 
                            className={`form-control ${getValidationClass('fechaNacimiento')}`} 
                            id="fechaNacimiento" 
                            name="fechaNacimiento" 
                            required
                            value={formData.fechaNacimiento} 
                            onChange={handleChange}
                        />
                        {renderMessage('fechaNacimiento')}
                    </div>

                    {/* Teléfono (opcional) */}
                    <div className="mb-3">
                        <label htmlFor="telefono" className="form-label text-light">Teléfono (opcional):</label>
                        <input 
                            type="text" 
                            id="telefono" 
                            className={`form-control ${getValidationClass('telefono')}`}
                            name="telefono" 
                            placeholder="Ej: 9 1234 5678"
                            maxLength={12}
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        {renderMessage('telefono')}
                    </div>


                    {/* Selección de región y comuna (Usando el nuevo componente) */}
                    <RegionComunaSelects
                        // 🚨 AJUSTE AQUÍ: Pasamos las props con los nombres que RegionComunaSelects espera:
                        currentRegion={selectedRegion}
                        currentComuna={selectedComuna}
                        onRegionChange={handleRegionChange} // Firma: (region: string) => void
                        onComunaChange={handleComunaChange} // Firma: (comuna: string) => void
                    />

                    {/* Dirección */}
                    <div className="mb-3">
                        <label htmlFor="direccion" className="form-label text-light">Dirección:</label>
                        <input 
                            type="text" 
                            className={`form-control ${getValidationClass('direccion')}`} 
                            id="direccion" 
                            name="direccion" 
                            placeholder="Introduzca una dirección" 
                            required
                            value={formData.direccion}
                            onChange={handleChange}
                        />
                        {renderMessage('direccion')}
                    </div>

                    {/* Código de referido */}
                    <div className="mb-3">
                        <label htmlFor="codigoRef" className="form-label text-light">Código referido (si posee)</label>
                        <input 
                            type="text" 
                            id="codigoRef" 
                            className="form-control" 
                            name="codigoRef"
                            placeholder="Introduzca un código de referido" 
                            maxLength={10}
                            // Usamos as any para manejar 'codigoRef' si no está explícitamente en RegistroFormData
                            value={(formData as any).codigoRef || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Registrarme
                    </button>

                    <p className="text-light mt-3 text-center">
                        ¿Ya tienes una cuenta?
                        <a href="/login" className="text-light text-decoration-underline">Iniciar sesión</a>.
                    </p>
                </form>
            </div>
            
            {/* Integración del GlobalModal */}
            <GlobalModal
                show={modalState.show}
                title={modalState.title}
                message={modalState.message}
                onClose={handleClose}
                onHiddenCallback={modalState.onHiddenCallback}
            />
        </div>
    );
};

export default UserRegister;
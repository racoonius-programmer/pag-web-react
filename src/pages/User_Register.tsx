// src/pages/User_Register.tsx

import React, { useState, useCallback } from 'react';
import RegionComunaSelects from '../components/RegionComunaSelects';
import type { Usuario } from '../types/User'; 
import Modal from '../components/Modal'; 
import { useNavigate } from 'react-router-dom';

// esta es la pagina

// ----------------------------------------------------------------------
// 1. CONSTANTES Y TIPOS LOCALES
// ----------------------------------------------------------------------

// ... (El resto de las constantes y tipos permanecen igual)

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TODAY_DATE_STRING = getTodayDateString(); 

const MIN_PASSWORD_LENGTH = 4;
const MAX_PASSWORD_LENGTH = 10;
const MIN_USERNAME_LENGTH = 3;
const MIN_ADDRESS_LENGTH = 5;
const TELEFONO_LENGTH = 9;
const MIN_AGE = 18; 

const ALLOWED_EMAIL_DOMAINS = [
    'hotmail.com', 
    'gmail.com', 
    'outlook.com', 
    'duocuc.cl',
    'admin.cl' 
];

interface FormErrorsBoolean {
    username: boolean;
    contrasena: boolean;
    confirmarContrasena: boolean;
    correo: boolean;
    fechaNacimiento: boolean;
    telefono: boolean;
    direccion: boolean;
    region: boolean;
    comuna: boolean;
    usuarioReferido: boolean;
}

type UsuarioRegistro = Omit<Usuario, 'id' | 'rol' | 'descuentoDuoc' | 'fotoPerfil'> & { 
    confirmarContrasena: string;
    usuarioReferido: string;
};


const initialFormData: UsuarioRegistro = {
    username: '',           
    contrasena: '',
    confirmarContrasena: '',
    correo: '',             
    fechaNacimiento: '',
    telefono: '', 
    region: '',
    comuna: '',
    direccion: '',
    usuarioReferido: '', 
};

const initialFormErrors: FormErrorsBoolean = {
    username: false,
    contrasena: false,
    confirmarContrasena: false,
    correo: false,
    fechaNacimiento: false,
    telefono: false,
    direccion: false,
    region: false,
    comuna: false,
    usuarioReferido: false,
};

interface ModalState {
    show: boolean;
    title: string;
    message: string;
    onHiddenCallback?: () => void;
}

// ----------------------------------------------------------------------
// 2. COMPONENTE USER_REGISTER
// ----------------------------------------------------------------------

const UserRegister: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UsuarioRegistro>(initialFormData);
    const [formErrors, setFormErrors] = useState<FormErrorsBoolean>(initialFormErrors);
    const [showPassword, setShowPassword] = useState({
        contrasena: false,
        confirmarContrasena: false,
    });
    const [modalState, setModalState] = useState<ModalState>({
        show: false,
        title: '',
        message: '',
        onHiddenCallback: undefined,
    });

    const mostrarModal = (message: string, title: string, onHiddenCallback?: () => void) => {
        setModalState({ show: true, title, message, onHiddenCallback });
    };

    const cerrarModal = () => {
        setModalState(prev => ({ ...prev, show: false }));
    };
    
    const isOver18 = (dateString: string): boolean => {
        if (!dateString) return false;
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= MIN_AGE;
    };

    const isValidEmailDomain = (email: string): boolean => {
        const parts = email.split('@');
        if (parts.length !== 2) return false;
        const domain = parts[1].toLowerCase();
        return ALLOWED_EMAIL_DOMAINS.includes(domain);
    };
    
    // Función de validación principal (código omitido por brevedad, no hay cambios)
    const validateField = useCallback((name: keyof UsuarioRegistro, value: string): boolean => {
        let isValid = true;
        setFormErrors(prev => ({ ...prev, [name as keyof FormErrorsBoolean]: false }));

        switch (name) {
            case 'username':
                isValid = value.length >= MIN_USERNAME_LENGTH;
                break;
            case 'contrasena':
                isValid = value.length >= MIN_PASSWORD_LENGTH && value.length <= MAX_PASSWORD_LENGTH;
                break;
            case 'confirmarContrasena':
                isValid = value === formData.contrasena && value.length >= MIN_PASSWORD_LENGTH;
                break;
            case 'correo':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && isValidEmailDomain(value);
                break;
            case 'fechaNacimiento':
                const dateSelected = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0); 

                if (dateSelected > today) {
                    isValid = false; 
                }
                if (isValid) {
                    isValid = isOver18(value);
                }
                break;
            case 'telefono':
                isValid = value.length === TELEFONO_LENGTH || value.length === 0;
                break;
            case 'region':
            case 'comuna':
                isValid = value.trim() !== ''; 
                break;
            case 'direccion':
                isValid = value.length >= MIN_ADDRESS_LENGTH;
                break;
            case 'usuarioReferido':
                if (value.length > 0) {
                    isValid = value.length >= MIN_USERNAME_LENGTH;
                } else {
                    isValid = true;
                }
                break;
        }

        if (!isValid) {
            setFormErrors(prev => ({ ...prev, [name as keyof FormErrorsBoolean]: true }));
        }

        return isValid;
    }, [formData.contrasena]);

    // ... (El resto de los manejadores de cambios y avisos permanecen igual)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        const fieldName = id as keyof UsuarioRegistro;
        
        let processedValue = value;
        if (fieldName === 'telefono') {
            processedValue = value.replace(/\D/g, '').substring(0, TELEFONO_LENGTH);
        }

        setFormData(prev => ({ ...prev, [fieldName]: processedValue }));
        
        validateField(fieldName, processedValue);
    };

    const handleRegionChange = (region: string) => {
        setFormData(prev => ({ ...prev, region, comuna: '' }));
        validateField('region', region);
    };

    const handleComunaChange = (comuna: string) => {
        setFormData(prev => ({ ...prev, comuna }));
        validateField('comuna', comuna);
    };
    
    const togglePasswordVisibility = (field: 'contrasena' | 'confirmarContrasena') => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const renderAviso = (field: keyof FormErrorsBoolean) => {
        if (!formErrors[field]) return null;

        const baseClass = "text-danger p-0 mt-1";
        let message = '';

        switch (field) {
            case 'username':
                message = `El nombre debe tener al menos ${MIN_USERNAME_LENGTH} caracteres.`;
                break;
            case 'contrasena':
                message = `La contraseña debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres.`;
                break;
            case 'confirmarContrasena':
                message = "Las contraseñas no coinciden.";
                break;
            case 'correo':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
                    message = "Formato de email incorrecto (ej: nombre@ejemplo.com).";
                } else {
                    message = `El dominio (${formData.correo.split('@')[1]}) no está permitido.`;
                }
                break;
            case 'fechaNacimiento':
                const dateSelected = new Date(formData.fechaNacimiento);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (dateSelected > today) {
                    message = "La fecha de nacimiento no puede ser una fecha futura.";
                } else {
                    message = `Debes ser mayor de ${MIN_AGE} años para registrarte.`;
                }
                break;
            case 'telefono':
                message = `Número incompleto (debe tener ${TELEFONO_LENGTH} dígitos).`;
                break;
            case 'region':
                message = "Debe seleccionar una región.";
                break;
            case 'comuna':
                message = "Debe seleccionar una comuna.";
                break;
            case 'direccion':
                message = `La dirección debe tener al menos ${MIN_ADDRESS_LENGTH} caracteres.`;
                break;
            case 'usuarioReferido':
                message = `Si ingresa un usuario referido, debe tener al menos ${MIN_USERNAME_LENGTH} caracteres.`;
                break;
            default:
                message = "Campo inválido.";
        }

        return <div className={baseClass}><i className="bi bi-x-circle-fill me-1"></i>{message}</div>;
    };


    // Manejador del envío del formulario - LÓGICA CRUCIAL DE LOCALSTORAGE
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let formIsValid = true;
        const accumulatedErrors: FormErrorsBoolean = { ...initialFormErrors }; 

        (Object.keys(initialFormErrors) as Array<keyof FormErrorsBoolean>).forEach(key => {
            const isValid = validateField(key as keyof UsuarioRegistro, formData[key as keyof UsuarioRegistro] || '');
            
            if (!isValid) {
                accumulatedErrors[key] = true;
                formIsValid = false;
            }
        });
        
        setFormErrors(accumulatedErrors); 

        // 3. Lógica final de envío
        if (formIsValid) {
            try {
                // 1. SIMULACIÓN DE REGISTRO EXITOSO: Cargar los datos
                const newUsuario: Usuario = {
                    ...formData,
                    id: Date.now(), 
                    rol: 'usuario', 
                    descuentoDuoc: formData.correo.endsWith('@duocuc.cl'), // Lógica simple para simular descuento Duoc
                    fotoPerfil: '/path/to/default.jpg', 
                }
                
                console.log("Usuario registrado con éxito:", newUsuario);

                // 2. GUARDAR SESIÓN EN LOCALSTORAGE
                try {
                    // Guardar SOLO los datos necesarios para la sesión (puedes omitir la contraseña)
                    const sessionData = {
                        id: newUsuario.id,
                        username: newUsuario.username,
                        rol: newUsuario.rol,
                        correo: newUsuario.correo,
                        descuentoDuoc: newUsuario.descuentoDuoc,
                    };
                    localStorage.setItem('currentUser', JSON.stringify(sessionData));
                    console.log("Datos de usuario guardados en localStorage.");
                } catch (e) {
                    console.error("Error al guardar en localStorage:", e);
                    // Puedes mostrar un modal de error aquí si el localStorage falla
                }


                // 3. Muestra modal de CONFIRMACIÓN y REDIRECCIONA
                mostrarModal(
                    "¡Tu cuenta ha sido creada con éxito! Serás redirigido a la página principal.",
                    "Registro Exitoso",
                    // Callback que se ejecuta DESPUÉS de que el modal se cierra
                    () => {
                        navigate("/main"); 
                    }
                );
            } catch (error) {
                // Maneja errores de red o API
                console.error("Error de registro (simulación de API):", error);
                mostrarModal(
                    "Ocurrió un error al registrar el usuario. Por favor, intenta de nuevo.",
                    "Error de Registro"
                );
            }
        } else {
            // Muestra modal de ERROR DE VALIDACIÓN
            console.log('El formulario contiene errores de validación y no se enviará.');
            mostrarModal(
                "Por favor, revisa los campos marcados en rojo. El formulario contiene errores y no se pudo registrar.",
                "Error de Validación"
            );
        }
    };


    return (
        <div className="container-fluid bg-dark text-white p-5 min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card bg-dark border-0 p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 className="text-center mb-4">Registro de Usuario</h2>
                
                <form onSubmit={handleSubmit} noValidate>
                    
                    {/* Nombre de Usuario (username) */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-light">Nombre de usuario:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="username" 
                            placeholder="Introduzca un nombre de usuario" 
                            maxLength={30}
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        {renderAviso('username')}
                    </div>

                    {/* Email (correo) */}
                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label text-light">Email:</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="correo" 
                            placeholder="nombre@ejemplo.com"
                            maxLength={50}
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                        {renderAviso('correo')}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="contrasena" className="form-label text-light">Contraseña:</label>
                        <input 
                            type={showPassword.contrasena ? "text" : "password"} 
                            className="form-control" 
                            id="contrasena" 
                            placeholder="Ingrese la contraseña"
                            maxLength={MAX_PASSWORD_LENGTH}
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                        />
                         <i 
                            className={`bi ${showPassword.contrasena ? "bi-eye-slash-fill" : "bi-eye-fill"} toggle-password`}
                            onClick={() => togglePasswordVisibility('contrasena')}
                            style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer', color: 'black' }}
                        ></i>
                        {renderAviso('contrasena')}
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="confirmarContrasena" className="form-label text-light">Confirmar Contraseña:</label>
                        <input 
                            type={showPassword.confirmarContrasena ? "text" : "password"} 
                            className="form-control" 
                            id="confirmarContrasena"
                            placeholder="Reingrese la contraseña"
                            maxLength={MAX_PASSWORD_LENGTH}
                            value={formData.confirmarContrasena}
                            onChange={handleChange}
                            required
                        />
                        <i 
                            className={`bi ${showPassword.confirmarContrasena ? "bi-eye-slash-fill" : "bi-eye-fill"} toggle-password`}
                            onClick={() => togglePasswordVisibility('confirmarContrasena')}
                            style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer', color: 'black' }}
                        ></i>
                        {renderAviso('confirmarContrasena')}
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div className="mb-3">
                        <label htmlFor="fechaNacimiento" className="form-label text-light">Fecha de Nacimiento:</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            id="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            max={TODAY_DATE_STRING} 
                            required
                        />
                        {renderAviso('fechaNacimiento')}
                    </div>

                    {/* Teléfono (Opcional) */}
                    <div className="mb-3">
                        <label htmlFor="telefono" className="form-label text-light">Teléfono (opcional):</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="telefono" 
                            placeholder="Ej: 9 1234 5678"
                            maxLength={TELEFONO_LENGTH}
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        {renderAviso('telefono')}
                    </div>
                    
                    {/* Usuario Referido (Opcional) */}
                    <div className="mb-3">
                        <label htmlFor="usuarioReferido" className="form-label text-light">Usuario Referido (opcional):</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="usuarioReferido" 
                            placeholder="Si aplica"
                            maxLength={30}
                            value={formData.usuarioReferido}
                            onChange={handleChange}
                        />
                        {renderAviso('usuarioReferido')}
                    </div>

                    {/* Selección de región y comuna */}
                    <div className="mb-3"> 
                        <RegionComunaSelects
                            onRegionChange={handleRegionChange}
                            onComunaChange={handleComunaChange}
                            currentRegion={formData.region}
                            currentComuna={formData.comuna}
                        />
                        
                        {renderAviso('region')}
                        {renderAviso('comuna')}
                    </div>
                    
                    {/* Dirección */}
                    <div className="mb-3">
                        <label htmlFor="direccion" className="form-label text-light">Dirección:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="direccion"
                            placeholder="Introduzca una dirección" 
                            maxLength={100}
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                        />
                        {renderAviso('direccion')}
                    </div>


                    {/* Botón de Envío */}
                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-primary btn-lg">
                            Registrarse
                        </button>
                    </div>
                </form>
            </div>

            {/* RENDERIZADO DEL MODAL */}
            <Modal
                show={modalState.show}
                title={modalState.title}
                message={modalState.message}
                onClose={cerrarModal}
                onHiddenCallback={modalState.onHiddenCallback}
            />
        </div>
    );
};

export default UserRegister;
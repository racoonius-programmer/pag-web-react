// src/pages/User_Login.tsx (CON LA REDIRECCIÓN DE ROL CORREGIDA)

import React, { useState, useCallback, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Usuario } from '../types/User'; // Asegúrate de que esta ruta sea correcta
import Modal from '../components/Modal'; // Asegúrate de usar la versión robusta con useRef
import PasswordInput from '../components/PasswordInput'; // Asegúrate de que esta ruta sea correcta

// ----------------------------------------------------------------------
// 1. CONSTANTES Y TIPOS
// ----------------------------------------------------------------------

interface LoginData {
    correo: string;
    contrasena: string;
}

interface ModalState {
    show: boolean;
    title: string;
    message: string;
    onHiddenCallback?: () => void;
}

const initialFormData: LoginData = {
    correo: '',
    contrasena: '',
};

const ALLOWED_EMAIL_DOMAINS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
const MAX_PASSWORD_LENGTH = 10;

// ----------------------------------------------------------------------
// 2. COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------

const UserLogin: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginData>(initialFormData);
    const [emailAviso, setEmailAviso] = useState<'valid' | string | null>(null);
    const [modalState, setModalState] = useState<ModalState>({
        show: false,
        title: '',
        message: '',
        onHiddenCallback: undefined,
    });

    const mostrarModal = useCallback(
        (message: string, title: string, onHiddenCallback?: () => void) => {
            setModalState({ show: true, title, message, onHiddenCallback });
        },
        []
    );

    const cerrarModal = () => {
        setModalState(prev => ({ ...prev, show: false }));
    };

    const isValidEmailDomain = (email: string): boolean => {
        return ALLOWED_EMAIL_DOMAINS.some(dominio => email.endsWith(dominio));
    };

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const fieldName = id as keyof LoginData;

        setFormData(prev => ({ ...prev, [fieldName]: value }));

        if (fieldName === 'correo') {
            const email = value.trim();
            const esValido = isValidEmailDomain(email);

            if (email === '') {
                setEmailAviso(null);
            } else if (esValido) {
                setEmailAviso('valid');
            } else {
                setEmailAviso(
                    '✖ El correo debe ser de los dominios: @duoc.cl, @profesor.duoc.cl o @gmail.com'
                );
            }
        }
    }, []);

    // ----------------------------------------------------------------------
    // 3. LÓGICA PRINCIPAL DE INICIO DE SESIÓN
    // ----------------------------------------------------------------------

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { correo, contrasena } = formData;

        // Validaciones
        if (!isValidEmailDomain(correo)) {
            mostrarModal(
                'El correo debe ser de los dominios: @duoc.cl, @profesor.duoc.cl o @gmail.com.',
                'Error de Inicio de Sesión'
            );
            return;
        }

        if (contrasena.length > MAX_PASSWORD_LENGTH) {
            mostrarModal(
                `La contraseña no puede tener más de ${MAX_PASSWORD_LENGTH} caracteres.`,
                'Error de Inicio de Sesión'
            );
            return;
        }

        // Obtener usuarios del localStorage
        const usuariosString = localStorage.getItem('usuarios');
        const usuarios: Usuario[] = usuariosString ? JSON.parse(usuariosString) : [];

        // Buscar usuario
        const usuario = usuarios.find(
            u => u.correo === correo && u.contrasena === contrasena
        );

        if (!usuario) {
            mostrarModal('Correo o contraseña incorrectos.', 'Error de Inicio de Sesión');
            return;
        }

        // Guardar sesión activa
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));

        // 🔹 CORRECCIÓN CRUCIAL: Determinar la ruta correcta según el rol
        const redirectPath = usuario.rol === 'admin' ? '/admin_main' : '/main';
        
        const welcomeMessage = usuario.rol === 'admin'
            ? `Bienvenido administrador ${usuario.username}!`
            : `Inicio de sesión exitoso. ¡Hola, ${usuario.username}!`;

        // Mostrar modal de éxito y redirigir al cerrarlo
        mostrarModal(welcomeMessage, 'Inicio de Sesión Exitoso', () => {
            navigate(redirectPath); // Esto se ejecuta al cerrar el modal
        });
        
        // Finalizar la función
        return; 
    };

    // ----------------------------------------------------------------------
    // 4. RENDERIZADO
    // ----------------------------------------------------------------------

    const renderEmailAviso = () => {
        if (!emailAviso) return null;

        const isSuccess = emailAviso === 'valid';
        const message = isSuccess ? '✔ Correo válido' : emailAviso;
        const className = isSuccess
            ? 'mt-1 small text-success'
            : 'mt-1 small text-danger';

        return <p className={className}>{message}</p>;
    };

    return (
        <div className="container-fluid bg-dark text-white p-5 min-vh-100 d-flex justify-content-center align-items-center">
            <div className="card bg-dark border-0 p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="text-center mb-4" style={{ fontWeight: 'bold' }}>
                    Inicio de Sesión
                </h3>

                <form onSubmit={handleSubmit} noValidate>
                    {/* Correo */}
                    <div className="mb-3 mt-3">
                        <label htmlFor="correo" className="form-label text-light">
                            Correo:
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="correo"
                            placeholder="Introduzca un correo"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                        {renderEmailAviso()}
                    </div>

                    {/* Contraseña */}
                    <PasswordInput
                        id="contrasena"
                        label="Contraseña"
                        placeholder="Introduzca una contraseña"
                        value={formData.contrasena}
                        onChange={handleChange}
                        maxLength={MAX_PASSWORD_LENGTH}
                    />

                    {/* Checkbox */}
                    <div className="form-check mb-3 text-light">
                        <label className="form-check-label">
                            <input className="form-check-input" type="checkbox" name="remember" /> Recordar contraseña
                        </label>
                    </div>

                    {/* Botón */}
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary btn-azul-electrico">
                            Iniciar sesión
                        </button>
                    </div>
                    <br />

                    {/* Enlace de Registro */}
                    <div>
                        <p className="text-light text-center">
                            ¿No tienes una cuenta?
                            <a
                                href="/register"
                                className="text-light text-decoration-underline ms-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/register');
                                }}
                            >
                                Regístrate
                            </a>
                        </p>
                    </div>
                </form>

                {/* Modal */}
                <Modal
                    show={modalState.show}
                    title={modalState.title}
                    message={modalState.message}
                    onClose={cerrarModal}
                    onHiddenCallback={modalState.onHiddenCallback}
                />
            </div>
        </div>
    );
};

export default UserLogin;
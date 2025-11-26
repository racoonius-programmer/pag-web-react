/**
 * User_Login.tsx
 * ----------------
 * Página de inicio de sesión para la aplicación.
 * Propósito y responsabilidades:
 * - Recoger credenciales (correo y contraseña) y validar formato/dominio de correo.
 * - Validar longitud máxima de la contraseña (según la regla local del proyecto).
 * - Verificar credenciales contra los usuarios almacenados en `localStorage`.
 * - Guardar el usuario autenticado en `localStorage` (clave `usuarioActual`).
 * - Mostrar errores o mensajes de éxito mediante el componente `Modal`.
 * - Redirigir al usuario al cerrar el modal según su rol (admin -> `/admin_main`, user -> `/main`).
 *
 * (resumen):
 * - Inputs: formulario controlado con `correo` y `contrasena`.
 * - Outputs: guarda `usuarioActual` en localStorage y navega a la ruta correspondiente.
 * - Error modes: muestra mensajes en modal para errores de validación o credenciales.
 *
 * Notas:
 * - El componente usa `useState` para controlar el formulario y estado local del modal.
 * - `mostrarModal` acepta un callback que se ejecuta cuando el modal se oculta; eso se
 *   usa para realizar la redirección tras el login exitoso.
 *
 * Dependencias internas usadas aquí:
 * - `Modal` (src/components/Modal.tsx): para mostrar mensajes de éxito/error.
 * - `PasswordInput` (src/components/PasswordInput.tsx): campo controlado de contraseña con UI.
 */

import React, { useState, useCallback, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal'; 
import PasswordInput from '../components/PasswordInput';
import { UsuarioService } from '../services/usuario.service';
import { setSessionItem } from '../hooks/useSessionStorage';

// ----------------------------------------------------------------------
// 1. CONSTANTES Y TIPOS
// ----------------------------------------------------------------------

// Estructura de los datos del formulario de inicio de sesión.
// - `correo`: email del usuario.
// - `contrasena`: contraseña en texto plano (este proyecto la guarda localmente para demo).
interface LoginData {
    correo: string;
    contrasena: string;
}

// Estado interno del modal utilizado para mostrar mensajes (error/éxito).
// - `onHiddenCallback` permite ejecutar una acción cuando el modal se oculta (ej: redirección).
interface ModalState {
    show: boolean;
    title: string;
    message: string;
    onHiddenCallback?: () => void;
}

// Valores iniciales del formulario: campos vacíos al montar el componente.
const initialFormData: LoginData = {
    correo: '',
    contrasena: '',
};

// Configuración local / reglas de validación simples usadas en este componente.
// - Dominios permitidos para el correo (regla del ejercicio / escuela).
const ALLOWED_EMAIL_DOMAINS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
// - Longitud máxima permitida para la contraseña (regla local).
const MAX_PASSWORD_LENGTH = 10;

// ----------------------------------------------------------------------
// 2. COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------

const UserLogin: React.FC = () => {
    // Hook de navegación (react-router) para redirigir tras el login.
    const navigate = useNavigate();

    // Estado del formulario: control absoluto de inputs.
    const [formData, setFormData] = useState<LoginData>(initialFormData);

    // Estado que muestra un aviso debajo del input de correo:
    // - 'valid' indica correo válido; string con mensaje indica error.
    const [emailAviso, setEmailAviso] = useState<'valid' | string | null>(null);

    // Estado del modal que muestra mensajes globales (error/éxito).
    const [modalState, setModalState] = useState<ModalState>({
        show: false,
        title: '',
        message: '',
        onHiddenCallback: undefined,
    });

    // Muestra el modal con un título, mensaje y un callback opcional que se ejecuta
    // cuando el modal se oculta. Usado para mostrar errores y para redirigir
    // tras un login exitoso (callback que llama a `navigate`).
    const mostrarModal = useCallback(
        (message: string, title: string, onHiddenCallback?: () => void) => {
            setModalState({ show: true, title, message, onHiddenCallback });
        },
        []
    );

    // Cierra el modal sin modificar el callback que se ejecutará tras ocultarse.
    const cerrarModal = () => {
        setModalState(prev => ({ ...prev, show: false }));
    };

    // Verifica si el correo termina en uno de los dominios permitidos.
    // Retorna true si el dominio es aceptado; false en otro caso.
    const isValidEmailDomain = (email: string): boolean => {
        return ALLOWED_EMAIL_DOMAINS.some(dominio => email.endsWith(dominio));
    };

    // Manejador genérico de inputs controlados.
    // - Usa el atributo `id` del input para mapear al campo del formulario.
    // - Cuando se edita el correo, actualiza `emailAviso` para mostrar feedback
    //   inmediato sobre dominios permitidos.
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const fieldName = id as keyof LoginData;

        setFormData(prev => ({ ...prev, [fieldName]: value }));

        if (fieldName === 'correo') {
            const email = value.trim();
            const esValido = isValidEmailDomain(email);

            if (email === '') {
                // Sin mensaje si el campo está vacío.
                setEmailAviso(null);
            } else if (esValido) {
                // Marca válido para mostrar feedback positivo.
                setEmailAviso('valid');
            } else {
                // Mensaje de error con los dominios permitidos.
                setEmailAviso(
                    '✖ El correo debe ser de los dominios: @duoc.cl, @profesor.duoc.cl o @gmail.com'
                );
            }
        }
    }, []);

    // ----------------------------------------------------------------------
    // 3. LÓGICA PRINCIPAL DE INICIO DE SESIÓN
    // ----------------------------------------------------------------------

    // Lógica de envío del formulario:
    // - Valida formato de correo y longitud de contraseña.
    // - Busca el usuario en `localStorage` (simulación de backend).
    // - Si las credenciales coinciden, guarda `usuarioActual` y muestra un modal
    //   de éxito. El modal recibe un callback que redirige según el rol.
    const handleSubmit = async (e: FormEvent) => {
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

        try {
            // Llamar al servicio de autenticación
            const usuario = await UsuarioService.login(correo, contrasena);

            if (!usuario) {
                // Credenciales incorrectas: mostrar error
                mostrarModal('Correo o contraseña incorrectos.', 'Error de Inicio de Sesión');
                return;
            }

            // Guardar sesión activa en sessionStorage (clave: 'usuarioActual').
            setSessionItem('usuarioActual', usuario);

            // Determinar ruta de redirección según el rol del usuario.
            const redirectPath = usuario.rol === 'admin' ? '/admin' : '/main';
            
            const welcomeMessage = usuario.rol === 'admin'
                ? `Bienvenido administrador ${usuario.username}!`
                : `Inicio de sesión exitoso. ¡Hola, ${usuario.username}!`;

            // Mostrar modal de éxito y ejecutar la redirección cuando el modal se oculte.
            mostrarModal(welcomeMessage, 'Inicio de Sesión Exitoso', () => {
                navigate(redirectPath); // Ejecutado al cerrar el modal
            });
        } catch (error) {
            // Mostrar error en caso de fallo de conexión con la API
            console.error('Error al conectar con la API:', error);
            mostrarModal('Error de conexión. Por favor, verifica que el servidor esté funcionando.', 'Error de Conexión');
        }
    };

    // ----------------------------------------------------------------------
    // 4. RENDERIZADO
    // ----------------------------------------------------------------------

    // Renderiza un pequeño mensaje bajo el input de correo indicando si el dominio
    // es válido o mostrando el mensaje de error configurado en `emailAviso`.
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

/*
    Archivos que importan/enlazan a `User_Login` y por qué:

    - src/App.tsx
        -> Importa el componente y lo expone en la ruta `/login` (Route).

    - src/components/Header.tsx
        -> Contiene un enlace (Link) a `/login` en el menú para que el usuario pueda
             acceder al formulario de inicio de sesión desde la navegación principal.

    - src/components/BannerBienvenida.tsx
        -> Botones/enlaces que llevan a `/login` para invitar al usuario a iniciar sesión.

    - src/pages/User_Register.tsx
        -> Contiene un enlace que redirige a `/login` tras registrarse o si el usuario
             desea iniciar sesión en lugar de registrarse.

    - src/pages/ProductDetail.tsx
        -> Redirige a `/login` cuando el usuario intenta acciones que requieren autenticación.

    - src/pages/Payment.tsx
        -> En flujos de pago no autenticados puede redirigir a `/login` para que el usuario
             complete el proceso tras autenticarse.

    Resumen:
    - `User_Login` se registra como la página de autenticación central. Se importa directamente
        en `App.tsx`, y otras partes de la app (Header, banners, páginas de producto/pago, registro)
        enlazan o redirigen a `/login` cuando necesitan que el usuario se autentique.
*/



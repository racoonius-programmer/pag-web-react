/*
    Cambios realizados:
    - En el flujo de registro, el usuario recién creado se guarda en `sessionStorage`
        usando `setSessionItem('usuarioActual', ...)` en lugar de `localStorage`.
    - Al verificar si hay un admin logueado, ahora se lee la clave desde
        `sessionStorage` con `getSessionItem`.
    - Motivo: mantener `usuarioActual` ligado a la sesión del navegador (cierres)
        mientras que la lista de `usuarios` se mantiene en `localStorage`.
*/
// src/hooks/useRegistroForm.ts
import { useState, useMemo, useCallback, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { getSessionItem, setSessionItem } from './useSessionStorage';
import { UsuarioService, type UsuarioPayload } from '../services/usuario.service';

// ----------------------------------------------------------------------
// TIPOS DE DATOS Y CONSTANTES
// ----------------------------------------------------------------------

// Define la interfaz para los datos del formulario
export interface RegistroFormData {
    username: string;
    correo: string;
    fechaNacimiento: string;
    contrasena: string;
    confirmarContrasena: string;
    telefono: string;
    direccion: string;
    region: string;
    comuna: string;
    // codigoRef (opcional) no está en tu definición actual, lo manejamos aparte si es necesario.
}

// Interfaz para mensajes de validación
export interface ValidationMessage {
    message: string;
    className: 'text-success' | 'text-danger' | '';
}

interface ValidationState {
    [key: string]: ValidationMessage;
}

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
const MIN_PASSWORD_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 100;

// ----------------------------------------------------------------------
// FUNCIONES AUXILIARES
// ----------------------------------------------------------------------

const calculateAge = (today: Date, birthDateStr: string): number => {
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    const day = today.getDate() - birthDate.getDate();

    if (month < 0 || (month === 0 && day < 0)) {
        age--;
    }
    return age;
};

// ----------------------------------------------------------------------
// CUSTOM HOOK: useRegistroForm
// ----------------------------------------------------------------------

export function useRegistroForm(
  region: string,
  comuna: string,
  showModal?: (msg: string, title?: string, cb?: () => void) => void,
  navigateFn?: (path: string) => void
) {
    const today = useMemo(() => new Date(), []);

    //  1. ESTADO ADICIONAL: Controla si el usuario ha interactuado
    const [isFormTouched, setIsFormTouched] = useState(false); 

    const [formData, setFormData] = useState<RegistroFormData>({
        username: '',
        correo: '',
        fechaNacimiento: '',
        contrasena: '',
        confirmarContrasena: '',
        telefono: '',
        direccion: '',
        region: region, // Inicializado con la prop
        comuna: comuna, // Inicializado con la prop
    });

    const [validationMessages, setValidationMessages] = useState<ValidationState>({});


    // --- Cálculo de fecha máxima (para el input date) ---
    const maxDate = useMemo(() => {
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }, [today]);
    
    // --- Sincronizar Región/Comuna con las Props ---
    useEffect(() => {
        setFormData(prev => ({ ...prev, region, comuna }));
    }, [region, comuna]);


    // --- Manejador genérico para inputs ---
    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        let newValue = value;

        // Lógica específica para el formato del teléfono
        if (id === 'telefono') {
            let valorLimpio = value.replace(/\D/g, "").substring(0, 9);
            let formatted = "";
            if (valorLimpio.length > 0) formatted += valorLimpio.charAt(0);
            if (valorLimpio.length > 1) formatted += " " + valorLimpio.substring(1, 5);
            if (valorLimpio.length > 5) formatted += " " + valorLimpio.substring(5, 9);
            newValue = formatted;
        }

        setFormData(prev => ({ ...prev, [id as keyof RegistroFormData]: newValue }));
        
        // 2. Marcar como tocado
        if (!isFormTouched) {
            setIsFormTouched(true);
        }

    }, [isFormTouched]);

    // --- Validaciones en Tiempo Real (Hook/Effect) ---
    useEffect(() => {
        const { username, correo, fechaNacimiento, contrasena, confirmarContrasena, telefono, direccion } = formData;
        const newMessages: ValidationState = {};
        
        // NOTA: Usamos una sola clave por campo para el feedback visual simplificado, 
        // a diferencia de tu versión original que usaba "contrasenaLargo" y "contrasenaCoincidencia".

        // 1. Username
        if (username.length > 0) {
            newMessages.username = username.length >= 3 
                ? { message: "✔ Nombre de usuario válido", className: 'text-success' }
                : { message: "✖ Debe tener al menos 3 caracteres", className: 'text-danger' };
        }

        // 2. Correo
        if (correo.length > 0) {
            const domain = correo.includes('@') ? `@${correo.split('@')[1]}` : '';
            const esCorreoValido = DOMINIOS_PERMITIDOS.includes(domain.toLowerCase());
            newMessages.correo = esCorreoValido
                ? { message: "✔ Correo válido", className: 'text-success' }
                : { message: `✖ Use dominios: ${DOMINIOS_PERMITIDOS.join(', ')}`, className: 'text-danger' };
        }

        // 3. Contraseña
        if (contrasena.length > 0) {
            newMessages.contrasena = contrasena.length >= MIN_PASSWORD_LENGTH
                ? { message: "✔ Longitud válida", className: 'text-success' }
                : { message: `✖ Mínimo ${MIN_PASSWORD_LENGTH} caracteres`, className: 'text-danger' };
        }

        // 4. Confirmar Contraseña
        if (confirmarContrasena.length > 0 || contrasena.length > 0) {
            newMessages.confirmarContrasena = contrasena === confirmarContrasena
                ? { message: "✔ Las contraseñas coinciden", className: 'text-success' }
                : { message: "✖ Las contraseñas no coinciden", className: 'text-danger' };
        }

        // 5. Fecha de Nacimiento / Edad
        if (fechaNacimiento) {
            const fechaSeleccionada = new Date(fechaNacimiento);
            const edad = calculateAge(today, fechaNacimiento);

            if (fechaSeleccionada > today) {
                newMessages.fechaNacimiento = { message: "✖ No puede ser una fecha futura.", className: 'text-danger' };
            } else if (edad < MIN_AGE) {
                newMessages.fechaNacimiento = { message: `✖ Debe ser mayor de ${MIN_AGE} años.`, className: 'text-danger' };
            } else if (edad > MAX_AGE) {
                newMessages.fechaNacimiento = { message: `✖ No puede tener más de ${MAX_AGE} años.`, className: 'text-danger' };
            } else {
                newMessages.fechaNacimiento = { message: "✔ Fecha válida.", className: 'text-success' };
            }
        }

        // 6. Teléfono
        const telefonoSinFormato = telefono.replace(/\D/g, "");
        if (telefonoSinFormato.length > 0) {
            newMessages.telefono = telefonoSinFormato.length === 9
                ? { message: "✔ Número válido (9 dígitos)", className: 'text-success' }
                : { message: "✖ Número incompleto (9 dígitos)", className: 'text-danger' };
        }

        // 7. Dirección
        if (direccion.length > 0) {
            newMessages.direccion = direccion.length >= 5
                ? { message: "✔ Dirección válida", className: 'text-success' }
                : { message: "✖ Mínimo 5 caracteres", className: 'text-danger' };
        }

        setValidationMessages(newMessages);

    }, [formData, today]);


    // --- Función de Validación Final (para el submit) ---
    // Esta función también actualizará los errores para que se muestren de forma inmediata
    const validateForm = useCallback((data: RegistroFormData): string | null => {
        let errorMessages: string[] = [];
        const { username, correo, fechaNacimiento, contrasena, confirmarContrasena, direccion } = data;

        // 1. Username
        if (username.length < 3) errorMessages.push("- Nombre de usuario muy corto.");
        
        // 2. Correo
        const domain = correo.includes('@') ? `@${correo.split('@')[1]}` : '';
        if (!DOMINIOS_PERMITIDOS.includes(domain.toLowerCase())) {
            errorMessages.push(`- Dominio de correo no permitido.`);
        }
        
        // 3. Contraseñas
        if (contrasena.length < MIN_PASSWORD_LENGTH) errorMessages.push(`- La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
        if (contrasena !== confirmarContrasena) errorMessages.push("- Las contraseñas no coinciden.");

        // 4. Fecha de Nacimiento
        if (!fechaNacimiento) {
            errorMessages.push("- Debes ingresar tu fecha de nacimiento.");
        } else {
            const edad = calculateAge(today, fechaNacimiento);
            if (new Date(fechaNacimiento) > today) errorMessages.push("- Fecha de nacimiento inválida (futura).");
            if (edad < MIN_AGE) errorMessages.push(`- Debes ser mayor de ${MIN_AGE} años.`);
            if (edad > MAX_AGE) errorMessages.push(`- No puedes tener más de ${MAX_AGE} años.`);
        }
        
        // 5. Dirección y Región/Comuna
        if (direccion.length < 5) errorMessages.push("- La dirección es muy corta.");
        if (!region) errorMessages.push("- Debes seleccionar una región.");
        if (!comuna) errorMessages.push("- Debes seleccionar una comuna.");
        
        // Si hay errores, retorna el mensaje concatenado
        if (errorMessages.length > 0) {
            return `Por favor, corrija los siguientes errores:\n${errorMessages.join('\n')}`;
        }

        return null; // Todo es válido
    }, [today, region, comuna]);

    // --- Función de Submit (Registro) ---
    const handleRegistroSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

        // 3. Forzar el estado 'touched' al intentar submit para mostrar todos los errores
        setIsFormTouched(true);

        const validationError = validateForm(formData);
        if (validationError) {
            showModal!(validationError, "Error de Validación");
            return;
        }

        // -------------------------------------------------------
        // LÓGICA DE REGISTRO (Usando API)
        // -------------------------------------------------------

        try {
            const { username, correo, fechaNacimiento, contrasena, telefono, direccion } = formData;
            const telefonoSinFormato = telefono.replace(/\D/g, "");
            const descuentoDuoc = correo.toLowerCase().includes("@duoc.cl") || correo.toLowerCase().includes("@profesor.duoc.cl");
            
            // Verificar si el usuario ya existe
            const usuariosExistentes = await UsuarioService.listar();
            if (usuariosExistentes.some(u => u.correo === correo)) {
                if (showModal) {
                    showModal("El correo ya está registrado.", "Error de Registro");
                }
                return;
            }

            // Crear nuevo usuario
            const nuevoUsuarioData: UsuarioPayload = {
                username,
                correo,
                contrasena,
                fechaNacimiento,
                telefono: telefonoSinFormato,
                direccion,
                region,
                comuna,
                rol: "usuario",
                descuentoDuoc,
                fotoPerfil: "img/header/user-logo-generic-white-alt.png"
            };

            const nuevoUsuario = await UsuarioService.crear(nuevoUsuarioData);
            
            let redirectPath = "/main";

            // Verificar si hay un admin logueado
            const usuarioLogueado = JSON.parse(getSessionItem("usuarioActual") || "null");
            if (usuarioLogueado && usuarioLogueado.rol === 'admin') {
                redirectPath = "/admin";
            } else {
                // Loguear al nuevo usuario (sesión de navegador)
                setSessionItem("usuarioActual", nuevoUsuario);
            }

            // Mostrar Modal con Callback de Redirección
            if (showModal) {
                showModal(
                    "¡Registro exitoso! Serás redirigido a la página principal.",
                    "Registro Exitoso",
                    () => {
                        if (navigateFn) {
                            navigateFn(redirectPath);
                        } else {
                            window.location.href = redirectPath;
                        }
                    }
                );
            }

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            if (showModal) {
                showModal("Error al registrar el usuario. Por favor, inténtalo de nuevo.", "Error de Conexión");
            }
        }

    }, [formData, validateForm, showModal, region, comuna, navigateFn]);


    return {
        formData,
        validationMessages,
        isFormTouched, // 
        handleChange,
        handleSubmit: handleRegistroSubmit, // 
        maxDate,
    };
 }

/*
    Archivos que importan / usan este hook `useRegistroForm`:
    - src/pages/User_Register.tsx
        * Aquí se importa con: `import { useRegistroForm, type RegistroFormData } from '../hooks/RegistroForms';`
        * Se usa para gestionar todo el formulario de registro: estado, validaciones y submit.
*/


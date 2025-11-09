// src/types/UserRegisterTypes.ts
import type { Usuario } from './User';

// ----------------------------------------------------------------------
// CONSTANTES
// ----------------------------------------------------------------------

export const MIN_PASSWORD_LENGTH = 4;
export const MAX_PASSWORD_LENGTH = 10;
export const MIN_USERNAME_LENGTH = 3;
export const MIN_ADDRESS_LENGTH = 5;
export const TELEFONO_LENGTH = 9;
export const MIN_AGE = 18; 

export const ALLOWED_EMAIL_DOMAINS = [
    'hotmail.com', 
    'gmail.com', 
    'outlook.com', 
    'duocuc.cl',
    'admin.cl' 
];

// ----------------------------------------------------------------------
// TIPOS E INTERFACES
// ----------------------------------------------------------------------

/**
 * Define el estado de error de validación para cada campo del formulario.
 */
export interface FormErrorsBoolean {
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

/**
 * Tipo que representa el estado del formulario de registro.
 * Extiende al tipo base Usuario, omitiendo campos asignados automáticamente 
 * y añadiendo campos específicos del formulario (confirmación, referido).
 */
export type UsuarioRegistro = Omit<Usuario, 'id' | 'rol' | 'descuentoDuoc' | 'fotoPerfil'> & { 
    confirmarContrasena: string;
    usuarioReferido: string;
};

/**
 * Define la estructura para el estado del Modal.
 */
export interface ModalState {
    show: boolean;
    title: string;
    message: string;
    onHiddenCallback?: () => void;
}


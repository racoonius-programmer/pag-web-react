/**
 * Define la estructura de un usuario en la base de datos simulada.
 */
// src/types/User.ts

// Asegúrate de que tu interfaz Usuario sea robusta
export interface Usuario {
    id: number;
    username: string;
    correo: string;
    fechaNacimiento: string; // YYYY-MM-DD
    contrasena: string;
    telefono: string; // formato limpio (sin espacios)
    direccion: string;
    region: string;
    comuna: string;
    rol: "usuario" | "admin";
    descuentoDuoc: boolean;
    fotoPerfil: string;
}

// Tipo para manejar los errores de validación en el estado de React
export interface FormErrors {
    correo?: string;
    contrasena?: string;
    confirmarContrasena?: string;
    username?: string;
    fecha?: string;
    telefono?: string;
    direccion?: string;
    region?: string;
    comuna?: string;
}

// Interfaz más simple para el usuario logueado en localStorage/Header
// (Puede ser UsuarioDB, pero a veces es bueno tener una versión ligera)
export interface UsuarioSesion {
  username: string;
  rol: 'user' | 'admin';
  fotoPerfil?: string; 
}
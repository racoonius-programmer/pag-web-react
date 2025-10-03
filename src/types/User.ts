/**
 * Define la estructura de un usuario en la base de datos simulada.
 */
export interface UsuarioDB {
  id: number;
  username: string;
  correo: string;
  contrasena: string;
  fechaNacimiento: string; // Formato YYYY-MM-DD
  telefono: string;
  direccion: string;
  region: string;
  comuna: string;
  fotoPerfil: string;
  rol: "admin" | "usuario"; // Roles tipificados
  descuentoDuoc: boolean;
}

// Interfaz más simple para el usuario logueado en localStorage/Header
// (Puede ser UsuarioDB, pero a veces es bueno tener una versión ligera)
export interface UsuarioSesion {
  username: string;
  rol: 'user' | 'admin';
  fotoPerfil?: string; 
}
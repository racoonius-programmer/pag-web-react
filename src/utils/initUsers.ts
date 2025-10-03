import usuariosDB from '../data/usuarios.json';
// Importa el tipo de la DB completa
import type { UsuarioDB } from '../types/User'; 

/**
 * Inicializa la base de datos de usuarios en localStorage si aún no existe.
 * Esto simula la carga inicial de usuarios desde un backend.
 */
export const initUserDB = (): void => {
    if (localStorage.getItem("usuarios")) {
        return;
    }

    // Convertimos y guardamos la DB JSON en localStorage
    const usuariosConId: UsuarioDB[] = usuariosDB as UsuarioDB[];
    
    localStorage.setItem("usuarios", JSON.stringify(usuariosConId));
    console.log("Base de datos de usuarios inicializada en localStorage.");
};
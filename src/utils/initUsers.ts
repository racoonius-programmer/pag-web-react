// src/utils/initUsers.ts

import usuariosDB from '../data/usuarios.json';
// Importamos el tipo Usuario de tu estructura
import type { Usuario } from '../types/User'; 

/**
 * Inicializa la base de datos de usuarios en localStorage si aún no existe.
 * Esto simula la carga inicial de usuarios desde un backend.
 */
export const initUserDB = (): void => {
    // 1. Verificar si ya existe en localStorage para no sobrescribir
    if (localStorage.getItem("usuarios")) {
        console.log("Base de datos de usuarios ya existe en localStorage. Omitiendo inicialización.");
        return;
    }

    // 2. Usar la data importada (ya tipada implícitamente por el JSON y tu tipo Usuario)
    // El 'as Usuario[]' asegura a TypeScript que el JSON coincide con el formato.
    const usuariosParaGuardar: Usuario[] = usuariosDB as Usuario[];
    
    // 3. Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuariosParaGuardar));
    console.log("Base de datos de usuarios inicializada en localStorage.");
};
/*
    Cambios realizados:
    - Ahora se lee `usuarioActual` desde `sessionStorage` en vez de `localStorage`.
    - Se utiliza el helper `getSessionItem` (desde `./useSessionStorage`) para obtener
        el valor de sesión. Razonamiento: la sesión del usuario debe expirar al cerrar
        el navegador; los datos persistentes (usuarios, puntos, wishlist) siguen en
        `localStorage` si es necesario.
    - Este cambio afecta la validación de rutas protegidas y la forma en que los
        componentes detectan si el usuario está autenticado.
*/

import { useState, useEffect } from 'react';
import { UsuarioService } from '../services/usuario.service';
import { getSessionItem } from './useSessionStorage';
import type { Usuario } from '../types/User';

/**
 * Hook personalizado para manejar el usuario actual
 * Obtiene los datos del usuario desde la API y mantiene sincronización
 */
export const useUsuarioActual = () => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const obtenerUsuarioActual = async (): Promise<Usuario | null> => {
        const usuarioActualRaw = getSessionItem("usuarioActual");
        if (!usuarioActualRaw) return null;

        try {
            const parsed = JSON.parse(usuarioActualRaw);
            if (parsed && typeof parsed === 'object' && parsed.id) {
                // Si tenemos un objeto usuario completo con ID, verificar en la API
                try {
                    const usuarioActualizado = await UsuarioService.obtener(parsed.id);
                    return usuarioActualizado;
                } catch {
                    // Si falla la API, usar el datos local como fallback
                    return parsed;
                }
            } else if (parsed && typeof parsed === 'object' && parsed.username) {
                // Si solo tenemos username, buscar en la API
                try {
                    const usuarios = await UsuarioService.listar();
                    return usuarios.find(u => u.username === parsed.username) || null;
                } catch {
                    return null;
                }
            } else if (typeof parsed === 'string') {
                // Si es solo un username string, buscar en la API
                try {
                    const usuarios = await UsuarioService.listar();
                    return usuarios.find(u => u.username === parsed) || null;
                } catch {
                    return null;
                }
            }
        } catch {
            // Si no es JSON válido, tratar como username plano
            try {
                const usuarios = await UsuarioService.listar();
                return usuarios.find(u => u.username === usuarioActualRaw) || null;
            } catch {
                return null;
            }
        }

        return null;
    };

    const cargarUsuario = async () => {
        try {
            setLoading(true);
            setError(null);
            const usuarioData = await obtenerUsuarioActual();
            setUsuario(usuarioData);
        } catch (err) {
            console.error('Error al cargar usuario:', err);
            setError('Error al cargar los datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuario();
    }, []);

    const refrescarUsuario = () => {
        cargarUsuario();
    };

    const esDuoc = !!(usuario && usuario.descuentoDuoc === true);

    return {
        usuario,
        loading,
        error,
        esDuoc,
        refrescarUsuario
    };
};
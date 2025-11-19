import { UsuarioService } from '../services/usuario.service';
import usuariosIniciales from '../data/usuarios.json';
import type { Usuario } from '../types/User';

/**
 * Script de migración para poblar la API con los usuarios iniciales
 * Este script toma los usuarios del archivo JSON local y los crea en la API
 */
export const migrarUsuariosAApi = async (): Promise<{success: boolean, message: string, migratedCount?: number}> => {
    try {
        console.log('Iniciando migración de usuarios a la API...');
        
        // Verificar si ya hay usuarios en la API
        const usuariosExistentes = await UsuarioService.listar();
        
        if (usuariosExistentes.length > 0) {
            console.log(`La API ya contiene ${usuariosExistentes.length} usuarios. Omitiendo migración.`);
            return {
                success: true,
                message: `La API ya contiene ${usuariosExistentes.length} usuarios. No se realizó migración.`
            };
        }

        const usuarios = usuariosIniciales as Usuario[];
        let migrados = 0;
        let errores = 0;

        console.log(`Migrando ${usuarios.length} usuarios a la API...`);

        // Migrar cada usuario
        for (const usuario of usuarios) {
            try {
                // Crear el payload sin el ID (la API lo generará)
                const { id, ...usuarioSinId } = usuario;
                
                const usuarioCreado = await UsuarioService.crear(usuarioSinId);
                console.log(`✅ Usuario migrado: ${usuarioCreado.username} (ID: ${usuarioCreado.id})`);
                migrados++;
            } catch (error) {
                console.error(`❌ Error al migrar usuario ${usuario.username}:`, error);
                errores++;
            }
        }

        const mensaje = `Migración completada: ${migrados} usuarios migrados exitosamente, ${errores} errores.`;
        console.log(mensaje);

        return {
            success: errores === 0,
            message: mensaje,
            migratedCount: migrados
        };

    } catch (error) {
        const errorMsg = `Error durante la migración: ${error}`;
        console.error(errorMsg);
        return {
            success: false,
            message: errorMsg
        };
    }
};

/**
 * Función para verificar si la migración es necesaria
 */
export const verificarMigracionNecesaria = async (): Promise<boolean> => {
    try {
        const usuariosEnApi = await UsuarioService.listar();
        return usuariosEnApi.length === 0;
    } catch (error) {
        console.error('Error al verificar si la migración es necesaria:', error);
        return false;
    }
};

/**
 * Función para ejecutar la migración automáticamente si es necesaria
 */
export const ejecutarMigracionAutomatica = async (): Promise<void> => {
    try {
        const necesitaMigracion = await verificarMigracionNecesaria();
        
        if (necesitaMigracion) {
            console.log('🔄 Ejecutando migración automática de usuarios...');
            const resultado = await migrarUsuariosAApi();
            
            if (resultado.success) {
                console.log('✅ Migración automática completada exitosamente');
            } else {
                console.warn('⚠️ La migración automática tuvo problemas:', resultado.message);
            }
        } else {
            console.log('ℹ️ La migración no es necesaria, la API ya contiene usuarios');
        }
    } catch (error) {
        console.error('❌ Error en la migración automática:', error);
    }
};

/**
 * Función para verificar la conexión con la API y listar usuarios
 */
export const verificarUsuariosEnApi = async (): Promise<void> => {
    try {
        console.log('🔍 Verificando usuarios en la API...');
        const usuarios = await UsuarioService.listar();
        
        console.log(`✅ Conexión exitosa! Se encontraron ${usuarios.length} usuarios en la API:`);
        usuarios.forEach((usuario, index) => {
            console.log(`${index + 1}. Usuario: ${usuario.username} | Correo: ${usuario.correo} | Rol: ${usuario.rol}`);
        });
        
        if (usuarios.length === 0) {
            console.log('⚠️ No hay usuarios en la API. Considera ejecutar la migración.');
        }
        
    } catch (error) {
        console.error('❌ Error al conectar con la API:', error);
        console.log('💡 Verifica que el servidor esté corriendo y la URL de la API sea correcta.');
    }
};
// Test para RegistroForms - Validaciones (Funciones Importadas)
// Este archivo contiene pruebas unitarias usando las funciones exportadas directamente
// Siguiendo el patrón Arrange-Act-Assert (AAA) como calculadora.test.ts

import { describe, expect, test } from "vitest";
// IMPORTAMOS LAS FUNCIONES DIRECTAMENTE (como en calculadora.test.ts)
import { 
    validateUsername, 
    validateCorreo, 
    validateContrasena,
    validateConfirmarContrasena,
    validateFechaNacimiento,
    validateTelefono,
    validateDireccion,
    calculateAge
} from '../../src/hooks/RegistroForms';

// ==============================================================================
// SUITE DE PRUEBAS PARA VALIDACIÓN DE USERNAME (PATRÓN CALCULADORA)
// ==============================================================================

describe('RegistroForms - Validaciones de Campos', () => {

    // ==============================================================================
    // PRUEBAS DE USERNAME (como calculadora: simple y directo)
    // ==============================================================================

    test('username con exactamente 3 caracteres debe ser válido', () => {
        // Arrange
        const username = 'abc';
        
        // Act
        const resultado = validateUsername(username);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✔ Nombre de usuario válido");
        expect(resultado!.className).toBe('text-success');
    });

    test('username con 2 caracteres debe ser inválido', () => {
        // Arrange
        const username = 'ab';
        
        // Act
        const resultado = validateUsername(username);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✖ Debe tener al menos 3 caracteres");
        expect(resultado!.className).toBe('text-danger');
    });

    test('username vacío no debe mostrar mensaje', () => {
        // Arrange
        const username = '';
        
        // Act
        const resultado = validateUsername(username);
        
        // Assert
        expect(resultado).toBeNull();
    });

    // ==============================================================================
    // PRUEBAS DE CORREO (patrón calculadora)
    // ==============================================================================

    test('correo con dominio @duoc.cl debe ser válido', () => {
        // Arrange
        const correo = 'test@duoc.cl';
        
        // Act
        const resultado = validateCorreo(correo);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✔ Correo válido");
        expect(resultado!.className).toBe('text-success');
    });

    test('correo con dominio @gmail.com debe ser válido', () => {
        // Arrange
        const correo = 'usuario@gmail.com';
        
        // Act
        const resultado = validateCorreo(correo);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✔ Correo válido");
        expect(resultado!.className).toBe('text-success');
    });

    test('correo con dominio inválido debe dar error', () => {
        // Arrange
        const correo = 'test@hotmail.com';
        
        // Act
        const resultado = validateCorreo(correo);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toContain("✖ Use dominios:");
        expect(resultado!.className).toBe('text-danger');
    });

    // ==============================================================================
    // PRUEBAS DE CONTRASEÑA (patrón calculadora)
    // ==============================================================================

    test('contraseña con 4 caracteres debe ser válida', () => {
        // Arrange
        const contrasena = '1234';
        
        // Act
        const resultado = validateContrasena(contrasena);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✔ Longitud válida");
        expect(resultado!.className).toBe('text-success');
    });

    test('contraseña con 3 caracteres debe ser inválida', () => {
        // Arrange
        const contrasena = '123';
        
        // Act
        const resultado = validateContrasena(contrasena);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✖ Mínimo 4 caracteres");
        expect(resultado!.className).toBe('text-danger');
    });

    // ==============================================================================
    // PRUEBAS DE CONFIRMAR CONTRASEÑA (patrón calculadora)
    // ==============================================================================

    test('contraseñas que coinciden deben ser válidas', () => {
        // Arrange
        const contrasena = 'password123';
        const confirmarContrasena = 'password123';
        
        // Act
        const resultado = validateConfirmarContrasena(contrasena, confirmarContrasena);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✔ Las contraseñas coinciden");
        expect(resultado!.className).toBe('text-success');
    });

    test('contraseñas que no coinciden deben dar error', () => {
        // Arrange
        const contrasena = 'password123';
        const confirmarContrasena = 'password456';
        
        // Act
        const resultado = validateConfirmarContrasena(contrasena, confirmarContrasena);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✖ Las contraseñas no coinciden");
        expect(resultado!.className).toBe('text-danger');
    });

    // ==============================================================================
    // PRUEBAS DE TELÉFONO (patrón calculadora)
    // ==============================================================================

    test('teléfono con 9 dígitos debe ser válido', () => {
        // Arrange
        const telefono = '9 1234 5678';
        
        // Act
        const resultado = validateTelefono(telefono);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✔ Número válido (9 dígitos)");
        expect(resultado!.className).toBe('text-success');
    });

    test('teléfono con 8 dígitos debe ser inválido', () => {
        // Arrange
        const telefono = '1234 5678';
        
        // Act
        const resultado = validateTelefono(telefono);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✖ Número incompleto (9 dígitos)");
        expect(resultado!.className).toBe('text-danger');
    });

    // ==============================================================================
    // PRUEBAS DE DIRECCIÓN (patrón calculadora)
    // ==============================================================================

    test('dirección con 5 caracteres debe ser válida', () => {
        // Arrange
        const direccion = 'Calle';
        
        // Act
        const resultado = validateDireccion(direccion);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✔ Dirección válida");
        expect(resultado!.className).toBe('text-success');
    });

    test('dirección con 4 caracteres debe ser inválida', () => {
        // Arrange
        const direccion = 'Casa';
        
        // Act
        const resultado = validateDireccion(direccion);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✖ Mínimo 5 caracteres");
        expect(resultado!.className).toBe('text-danger');
    });

    // ==============================================================================
    // PRUEBAS DE FECHA DE NACIMIENTO Y EDAD (patrón calculadora)
    // ==============================================================================

    test('fecha de nacimiento que da 20 años debe ser válida', () => {
        // Arrange
        const today = new Date('2025-11-05'); // 5 de noviembre de 2025
        const fechaNacimiento = '2005-11-05'; // Exactamente 20 años
        
        // Act
        const resultado = validateFechaNacimiento(fechaNacimiento, today);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✔ Fecha válida.");
        expect(resultado!.className).toBe('text-success');
    });

    test('fecha de nacimiento que da 17 años debe ser inválida', () => {
        // Arrange
        const today = new Date('2025-11-05');
        const fechaNacimiento = '2008-11-05'; // 17 años
        
        // Act
        const resultado = validateFechaNacimiento(fechaNacimiento, today);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✖ Debe ser mayor de 18 años.");
        expect(resultado!.className).toBe('text-danger');
    });

    test('fecha futura debe ser inválida', () => {
        // Arrange
        const today = new Date('2025-11-05');
        const fechaNacimiento = '2026-01-01'; // Fecha futura
        
        // Act
        const resultado = validateFechaNacimiento(fechaNacimiento, today);
        
        // Assert
        expect(resultado).not.toBeNull();
        expect(resultado!.message).toBe("✖ No puede ser una fecha futura.");
        expect(resultado!.className).toBe('text-danger');
    });

    // ==============================================================================
    // PRUEBAS DE FUNCIÓN calculateAge (patrón calculadora)
    // ==============================================================================

    test('calcular edad de persona nacida hace 25 años debe dar 25', () => {
        // Arrange
        const today = new Date('2025-11-05');
        const fechaNacimiento = '2000-11-05';
        
        // Act
        const edad = calculateAge(today, fechaNacimiento);
        
        // Assert
        expect(edad).toBe(25);
    });

    test('calcular edad cuando aún no cumple años debe restar 1', () => {
        // Arrange
        const today = new Date('2025-10-05'); // 5 de octubre
        const fechaNacimiento = '2000-11-05'; // Nació el 5 de noviembre
        
        // Act
        const edad = calculateAge(today, fechaNacimiento);
        
        // Assert
        expect(edad).toBe(24); // Aún no cumple 25
    });

});

// ==============================================================================
// DOCUMENTACIÓN PARA APRENDIZAJE
// ==============================================================================

/*
🎯 COMPARACIÓN: CALCULADORA vs REGISTRO FORMS

┌─────────────────────────────────────────────────────────────────────────────┐
│                            CALCULADORA                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ import { restar, sumar } from '../../src/example/calculadora'              │
│                                                                             │
│ test('sumar 2 y 2 debe resultar 4', () => {                                │
│     const x = 2;                                                            │
│     const y = 2;                                                            │
│     const resultado = sumar(x, y);                                          │
│     expect(resultado).toBe(4);                                              │
│ });                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         REGISTRO FORMS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ import { validateUsername, validateCorreo } from '../../src/hooks/...'     │
│                                                                             │
│ test('username con 3 caracteres debe ser válido', () => {                  │
│     const username = 'abc';                                                 │
│     const resultado = validateUsername(username);                           │
│     expect(resultado!.message).toBe("✔ Nombre de usuario válido");         │
│ });                                                                         │
└─────────────────────────────────────────────────────────────────────────────┘

✅ VENTAJAS DE ESTE ENFOQUE:
- Importación directa como calculadora
- Funciones puras (entrada → salida)
- Sin dependencias de React
- Pruebas rápidas y simples
- Fácil de debuggear
- Misma estructura que calculadora.test.ts

🚀 PARA EJECUTAR:
npm run test RegistroForms.test.tsx
*/
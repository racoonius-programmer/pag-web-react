/**
 * @vitest-environment jsdom
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRegistroForm } from "../../src/hooks/RegistroForms";
import type { ChangeEvent, FormEvent } from 'react';

// ----------------------------------------------------------------------
// MOCKS Y AYUDANTES
// ----------------------------------------------------------------------

const createChangeEvent = (id: string, value: string): ChangeEvent<HTMLInputElement | HTMLSelectElement> => ({
    target: { id, value } as any,
} as ChangeEvent<HTMLInputElement | HTMLSelectElement>);

// Mock de un evento de submit
const createSubmitEvent = (): FormEvent<HTMLFormElement> => ({
    preventDefault: vi.fn(),
} as any);

const validFormData = {
    username: 'testuser',
    correo: 'test@duoc.cl',
    fechaNacimiento: '2000-01-01',
    contrasena: 'password123',
    confirmarContrasena: 'password123',
    telefono: '9 8765 4321',
    direccion: 'Calle Falsa 123',
    region: 'Metropolitana',
    comuna: 'Santiago',
};

// ----------------------------------------------------------------------
// CONFIGURACIÓN DE PRUEBAS
// ----------------------------------------------------------------------

describe('Pruebas unitarias Registro', () => {

    // Mockear funciones pasadas como props
    const showModalMock = vi.fn();
    const navigateFnMock = vi.fn();

    // Fijar la fecha actual para pruebas consistentes de edad
    beforeEach(() => {
        vi.useFakeTimers();
        const mockDate = new Date(2025, 0, 15); // 15-Ene-2025
        vi.setSystemTime(mockDate);

        // Limpiar mocks y localStorage antes de cada prueba
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ----------------------------------------------------------------------
    // PRUEBAS
    // ----------------------------------------------------------------------

    test('debe inicializar correctamente las regiones', () => {
        // Arrange
        const regionInicial = 'Valparaíso';
        const comunaInicial = 'Viña del Mar';

        // Act
        const { result } = renderHook(() => useRegistroForm(regionInicial, comunaInicial));

        // Assert
        expect(result.current.formData.region).toBe(regionInicial);
        expect(result.current.formData.comuna).toBe(comunaInicial);
        expect(result.current.formData.username).toBe('');
        expect(result.current.isFormTouched).toBe(false);
        // maxDate debe ser '2025-01-15' basado en el mock de fecha
        expect(result.current.maxDate).toBe('2025-01-15');
    });

    test('Se debe autoformatear el número de teléfono', () => {
        // Arrange
        const { result } = renderHook(() => useRegistroForm('R', 'C'));

        // Act
        act(() => {
            result.current.handleChange(createChangeEvent('telefono', '912345678'));
        });

        // Assert
        expect(result.current.formData.telefono).toBe('9 1234 5678');
    });

    test('validaciones en tiempo real deben reaccionar a los cambios (ej. username corto)', () => {
        // Arrange
        const { result } = renderHook(() => useRegistroForm('R', 'C'));

        // Act
        act(() => {
            result.current.handleChange(createChangeEvent('username', 'ab'));
        });

        // Assert
        expect(result.current.validationMessages.username.message).toContain('3 caracteres');
        expect(result.current.validationMessages.username.className).toBe('text-danger');
    });

    test('validaciones en tiempo real deben mostrar éxito (ej. correo válido)', () => {
        // Arrange
        const { result } = renderHook(() => useRegistroForm('R', 'C'));

        // Act
        act(() => {
            result.current.handleChange(createChangeEvent('correo', 'test@gmail.com'));
        });

        // Assert
        expect(result.current.validationMessages.correo.message).toContain('Correo válido');
        expect(result.current.validationMessages.correo.className).toBe('text-success');
    });

    test('Validaciones en tiempo real deben fallar con dominio de correo no permitido', () => {
        // Arrange
        const { result } = renderHook(() => useRegistroForm('R', 'C'));

        // Act
        act(() => {
            result.current.handleChange(createChangeEvent('correo', 'test@hotmail.com'));
        });

        // Assert
        expect(result.current.validationMessages.correo.className).toBe('text-danger');
    });

    test('Validaciones en tiempo real deben validar edad (MENOR de 18)', () => {
        // Arrange
        // Fecha actual mockeada: 2025-01-15
        const { result } = renderHook(() => useRegistroForm('R', 'C'));

        // Act
        act(() => {
            // 2008 -> 17 años
            result.current.handleChange(createChangeEvent('fechaNacimiento', '2008-05-10'));
        });

        // Assert
        expect(result.current.validationMessages.fechaNacimiento.message).toContain('mayor de 18');
        expect(result.current.validationMessages.fechaNacimiento.className).toBe('text-danger');
    });

    test('Validaciones en tiempo real deben validar edad (MAYOR de 18)', () => {
        // Arrange
        // Fecha actual mockeada: 2025-01-15
        const { result } = renderHook(() => useRegistroForm('R', 'C'));

        // Act
        act(() => {
            // 2002 -> 23 años
            result.current.handleChange(createChangeEvent('fechaNacimiento', '2002-01-01'));
        });

        // Assert
        expect(result.current.validationMessages.fechaNacimiento.message).toContain('Fecha válida');
        expect(result.current.validationMessages.fechaNacimiento.className).toBe('text-success');
    });

    test('Debe mostrar modal de error si la validación falla', () => {
        // Arrange
        const { result } = renderHook(() => useRegistroForm('R', 'C', showModalMock, navigateFnMock));

        // Act
        act(() => {
            // Intentar enviar formulario vacío
            result.current.handleSubmit(createSubmitEvent());
        });

        // Assert
        expect(showModalMock).toHaveBeenCalledOnce();
        expect(showModalMock).toHaveBeenCalledWith(expect.any(String), "Error de Validación");
        expect(result.current.isFormTouched).toBe(true); // Debe forzar 'touched'
        expect(localStorage.getItem('usuarios')).toBeNull(); // No se debe guardar nada
    });

    test('Debe fallar si el correo ya existe', () => {
        // Arrange
        const correoExistente = 'yaexiste@gmail.com';
        localStorage.setItem('usuarios', JSON.stringify([{ id: 1, correo: correoExistente }]));
        
        const { result } = renderHook(() => useRegistroForm('Metropolitana', 'Santiago', showModalMock, navigateFnMock));

        // Simular llenado de formulario válido
        act(() => {
            result.current.handleChange(createChangeEvent('username', 'Test User'));
            result.current.handleChange(createChangeEvent('correo', correoExistente)); // Correo existente
            result.current.handleChange(createChangeEvent('fechaNacimiento', '2000-01-01'));
            result.current.handleChange(createChangeEvent('contrasena', '123456'));
            result.current.handleChange(createChangeEvent('confirmarContrasena', '123456'));
            result.current.handleChange(createChangeEvent('direccion', 'Calle Falsa 123'));
        });
        
        // Act
        act(() => {
            result.current.handleSubmit(createSubmitEvent());
        });

        // Assert
        expect(showModalMock).toHaveBeenCalledWith("El correo ya está registrado.", "Error de Registro");
        const usuarios = JSON.parse(localStorage.getItem('usuarios')!);
        expect(usuarios.length).toBe(1); // No debe haber agregado el nuevo usuario
    });


    test('Debe registrar exitosamente un usuario y loguearlo', () => {
        // Arrange
        const { result } = renderHook(() => useRegistroForm('Metropolitana', 'Santiago', showModalMock, navigateFnMock));

        // Llenar el formulario con datos válidos
        act(() => {
            result.current.handleChange(createChangeEvent('username', 'Usuario Valido'));
            result.current.handleChange(createChangeEvent('correo', 'nuevo@duoc.cl')); // duoc para descuento
            result.current.handleChange(createChangeEvent('fechaNacimiento', '2000-01-01'));
            result.current.handleChange(createChangeEvent('contrasena', 'password123'));
            result.current.handleChange(createChangeEvent('confirmarContrasena', 'password123'));
            result.current.handleChange(createChangeEvent('direccion', 'Avenida Siempre Viva 742'));
            result.current.handleChange(createChangeEvent('telefono', '911223344'));
        });

        // Act
        act(() => {
            result.current.handleSubmit(createSubmitEvent());
        });

        // Assert
        // 1. Verificar localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios')!);
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')!);
        
        expect(usuarios).toHaveLength(1);
        expect(usuarios[0].correo).toBe('nuevo@duoc.cl');
        expect(usuarios[0].descuentoDuoc).toBe(true);
        expect(usuarioActual).toBeDefined();
        expect(usuarioActual.id).toBe(1);

        // 2. Verificar Modal
        expect(showModalMock).toHaveBeenCalledWith(
            expect.stringContaining('¡Registro exitoso!'),
            "Registro Exitoso",
            expect.any(Function) // El callback de redirección
        );
        
        // 3. Simular click en "Aceptar" del modal (ejecutar el callback)
        const callbackRedireccion = showModalMock.mock.calls[0][2];
        act(() => {
            callbackRedireccion();
        });

        // 4. Verificar Redirección
        expect(navigateFnMock).toHaveBeenCalledWith('/main');
    });

});
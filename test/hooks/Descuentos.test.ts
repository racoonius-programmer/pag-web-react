/**
 * @vitest-environment jsdom
 */
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usarDescuento } from "../../src/hooks/Descuentos"; // Asegúrate que la ruta sea correcta

interface Product {
    id: number;
    nombre: string;
    precio: number;
    codigo: string;
}

interface UsuarioSesion {
    id: number;
    username: string;
    rol: 'user' | 'admin';
}
// Productos de prueba
const productoBase: Product = { id: 1, nombre: 'Producto 1000', precio: 1000, codigo: 'PROD-1000' };
const productoConDecimal: Product = { id: 2, nombre: 'Producto 99', precio: 99, codigo: 'PROD-99' };

/**
 * Ayudante para simular el estado de localStorage
 * @param usuario Objeto de usuario o null para limpiar
 */
const mockLocalStorageUsuario = (usuario: UsuarioSesion | null) => {
    if (usuario) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    } else {
        localStorage.removeItem('usuarioActual');
    }
};

// ----------------------------------------------------------------------
// PRUEBAS
// ----------------------------------------------------------------------

describe('Hook: usarDescuento', () => {

    // Limpiar localStorage antes y después de cada prueba
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    // ----------------------------------------------------------------------
    // TESTS
    // ----------------------------------------------------------------------

    test('no debe aplicar descuento si el usuario no es Duoc', () => {
        // Arrange
        const usuario = { id: 1, username: 'usuario_normal', rol: 'user' };
        mockLocalStorageUsuario(usuario as UsuarioSesion);

        // Act
        const { result } = renderHook(() => usarDescuento(productoBase));

        // Assert
        expect(result.current.precioFinal).toBe(1000);
        expect(result.current.tieneDescuento).toBe(false);
    });


    test('debe redondear el precio final correctamente', () => {
        // Arrange
        const usuario = { id: 1, username: 'profesor_duoc', rol: 'user' };
        mockLocalStorageUsuario(usuario as UsuarioSesion);

        // Act
        const { result } = renderHook(() => usarDescuento(productoConDecimal)); // precio 99

        // Assert
        // 99 * 0.8 = 79.2. Math.round(79.2) = 79
        expect(result.current.precioFinal).toBe(79);
        expect(result.current.tieneDescuento).toBe(true);
    });

    test('Vuelve a calcular el precio si el producto cambia (usando rerender)', () => {
        // Arrange
        const usuario = { id: 1, username: 'user_duoc', rol: 'user' };
        mockLocalStorageUsuario(usuario as UsuarioSesion);

        // Render inicial con productoBase (1000)
        const { result, rerender } = renderHook(
            (props: { producto: Product }) => usarDescuento(props.producto),
            { initialProps: { producto: productoBase } }
        );

        // Assert 1 (Inicial)
        expect(result.current.precioFinal).toBe(800);

        // Act: Volver a renderizar con un producto diferente
        rerender({ producto: productoConDecimal }); // 99

        // Assert 2 (Después del rerender)
        expect(result.current.precioFinal).toBe(79);
    });

});
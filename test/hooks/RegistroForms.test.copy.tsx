// ===============================================================================
// DOCUMENTACIÓN COMPLETA: PRUEBAS UNITARIAS CON REACT
// ===============================================================================
// 
// Este archivo explica PASO A PASO cómo funcionan las pruebas unitarias con React
// Comparando con el ejemplo simple de calculadora.test.ts
//
// 📚 NIVEL: Principiante a Intermedio
// 🎯 OBJETIVO: Que cualquiera pueda entender la lógica completa
// ===============================================================================

// Test para User_Register.tsx - Validación de Username (Hook Completo)
// Este archivo contiene pruebas unitarias del hook useRegistroForm completo
// Siguiendo el patrón Arrange-Act-Assert (AAA)

// ===============================================================================
// PARTE 1: IMPORTACIONES - ¿QUÉ NECESITAMOS Y POR QUÉ?
// ===============================================================================

// 🔧 HERRAMIENTAS BÁSICAS DE PRUEBA (igual que en calculadora.test.ts)
import { describe, test, expect, beforeEach, vi } from 'vitest';
/*
EXPLICACIÓN:
- describe: Agrupa pruebas relacionadas (como en calculadora)
- test: Define una prueba individual (como en calculadora)
- expect: Hace las verificaciones (como en calculadora)
- beforeEach: Se ejecuta antes de cada prueba (NO está en calculadora)
- vi: Herramientas de simulación de Vitest (NO está en calculadora)
*/

// 🚀 HERRAMIENTAS ESPECIALES PARA REACT (NO están en calculadora)
import { renderHook, act } from '@testing-library/react';
/*
EXPLICACIÓN:
¿Por qué necesitamos esto?

CALCULADORA (simple):
const resultado = sumar(2, 2);  // ← Función normal, llamada directa

HOOK DE REACT (complejo):
const hook = useRegistroForm();  // ❌ ERROR! Los hooks necesitan estar en React
const { result } = renderHook(() => useRegistroForm());  // ✅ CORRECTO!

- renderHook(): Crea un componente React "falso" para que el hook funcione
- act(): Envuelve cambios de estado para que React los procese correctamente
*/

// 📦 EL HOOK QUE QUEREMOS PROBAR
import { useRegistroForm } from '../../src/hooks/RegistroForms';
/*
COMPARACIÓN:
CALCULADORA: import { sumar } from '../../src/example/calculadora'  // ← Función simple
HOOK: import { useRegistroForm } from '../../src/hooks/RegistroForms';  // ← Hook complejo
*/

// ===============================================================================
// PARTE 2: MOCKS (SIMULACIONES) - ¿QUÉ SON Y POR QUÉ LOS NECESITAMOS?
// ===============================================================================

/*
🤔 PROBLEMA: useRegistroForm depende de otros elementos

// Dentro de useRegistroForm:
import { useModal } from './Modal';  // ← DEPENDENCIA 1
export function useRegistroForm(region, comuna, showModal, navigateFn) {  // ← DEPENDENCIAS 2 y 3

❌ PROBLEMA: Si probamos useRegistroForm, también estaríamos probando useModal
✅ SOLUCIÓN: Crear versiones "falsas" (mocks) de las dependencias
*/

// 🎭 MOCK 1: Simulamos el hook useModal
const mockShowModal = vi.fn();  // ← Crea una función "falsa"
vi.mock('../../src/hooks/Modal', () => ({
  useModal: () => ({
    showModal: mockShowModal,        // ← Función falsa que podemos controlar
    modalState: { 
      show: false, 
      title: '', 
      message: '', 
      onHiddenCallback: null 
    },
    handleClose: vi.fn(),           // ← Otra función falsa
  }),
}));

/*
ANALOGÍA CON CALCULADORA:
Imagina que tu función sumar() dependiera de una función compleja internetConnection():

// Sin mock (malo):
test('sumar con internet', () => {
  const resultado = sumar(2, 2);  // ← También probaría la conexión a internet
});

// Con mock (bueno):
vi.mock('./internetConnection', () => ({ connectToInternet: vi.fn() }));
test('sumar con internet mockeado', () => {
  const resultado = sumar(2, 2);  // ← Solo prueba sumar(), internet es falso
});
*/

// 🧭 MOCK 2: Simulamos la función navigate
const mockNavigate = vi.fn();
/*
EXPLICACIÓN:
useRegistroForm necesita una función navigate para redirigir páginas.
En las pruebas no queremos redirigir realmente, solo verificar que se llame.
*/

// ===============================================================================
// PARTE 3: HELPER FUNCTION - SIMPLIFICAR LA COMPLEJIDAD
// ===============================================================================

/**
 * Helper para renderizar el hook useRegistroForm con parámetros por defecto
 * 
 * COMPARACIÓN CON CALCULADORA:
 * 
 * CALCULADORA (simple):
 * const resultado = sumar(2, 2);  // ← Llamada directa
 * 
 * HOOK (complejo):
 * const { result } = renderHook(() => useRegistroForm('', '', mockShowModal, mockNavigate));
 * 
 * HELPER (simplificado):
 * const { result } = renderRegistroFormHook();  // ← Más fácil de usar
 */
const renderRegistroFormHook = (region = '', comuna = '') => {
  return renderHook(() => 
    useRegistroForm(region, comuna, mockShowModal, mockNavigate)
  );
};

/*
¿POR QUÉ UN HELPER?
- Sin helper: Repetir código largo en cada prueba
- Con helper: Una línea simple en cada prueba
*/

// ===============================================================================
// PARTE 4: SUITE DE PRUEBAS - ESTRUCTURA PRINCIPAL
// ===============================================================================

describe('User_Register - Validación de Username (Hook Completo)', () => {
  /*
  COMPARACIÓN CON CALCULADORA:
  
  CALCULADORA:
  describe('Pruebas modulo calculadora', () => {
    test('sumar 2 y 2 debe resultar 4', () => { ... });
  });
  
  HOOK:
  describe('User_Register - Validación de Username', () => {
    test('username con 3 caracteres debe ser válido', () => { ... });
  });
  
  ✅ IGUAL: Ambos usan describe() para agrupar pruebas relacionadas
  */

  // ===============================================================================
  // PARTE 5: beforeEach - LIMPIEZA ANTES DE CADA PRUEBA
  // ===============================================================================

  beforeEach(() => {
    vi.clearAllMocks();  // ← Limpia las funciones falsas
  });

  /*
  ¿POR QUÉ beforeEach?
  
  CALCULADORA (no lo necesita):
  test('primera prueba', () => {
    const resultado = sumar(2, 2);  // ← Función pura, sin efectos secundarios
  });
  test('segunda prueba', () => {
    const resultado = sumar(3, 3);  // ← No se ve afectada por la primera
  });
  
  HOOK (sí lo necesita):
  test('primera prueba', () => {
    // mockShowModal se llama 1 vez
  });
  test('segunda prueba', () => {
    // Sin clearAllMocks(), mockShowModal "recuerda" la llamada anterior
    // Podría causar errores inesperados
  });
  */

  // ===============================================================================
  // PARTE 6: PRUEBA INDIVIDUAL - PASO A PASO
  // ===============================================================================

  test('username con exactamente 3 caracteres debe ser válido', () => {
    /*
    COMPARACIÓN DETALLADA:
    
    ┌─────────────────────────────────────────────────────────────────┐
    │                        CALCULADORA                              │
    ├─────────────────────────────────────────────────────────────────┤
    │ test('sumar 2 y 2 debe resultar 4', () => {                    │
    │   // Arrange - Preparar datos                                  │
    │   const x = 2;                                                 │
    │   const y = 2;                                                 │
    │                                                                │
    │   // Act - Ejecutar función                                    │
    │   const resultado = sumar(x, y);                               │
    │                                                                │
    │   // Assert - Verificar resultado                              │
    │   expect(resultado).toBe(4);                                   │
    │ });                                                            │
    └─────────────────────────────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────────────────────────────┐
    │                           HOOK                                  │
    ├─────────────────────────────────────────────────────────────────┤
    │ test('username con 3 caracteres debe ser válido', () => {      │
    │   // Arrange - Preparar hook                                   │
    │   const { result } = renderRegistroFormHook();                 │
    │                                                                │
    │   // Act - Simular interacción del usuario                     │
    │   act(() => {                                                  │
    │     const event = { target: { id: 'username', value: 'abc' }}; │
    │     result.current.handleChange(event);                        │
    │   });                                                          │
    │                                                                │
    │   // Assert - Verificar resultado                              │
    │   expect(result.current.formData.username).toBe('abc');        │
    │   expect(result.current.validationMessages.username).toEqual({ │
    │     message: "✔ Nombre de usuario válido",                     │
    │     className: 'text-success'                                  │
    │   });                                                          │
    │ });                                                            │
    └─────────────────────────────────────────────────────────────────┘
    */

    // ═══════════════════════════════════════════════════════════════
    // ARRANGE - PREPARAR EL ENTORNO DE PRUEBA
    // ═══════════════════════════════════════════════════════════════
    
    const { result } = renderRegistroFormHook();
    /*
    ¿QUÉ HACE ESTO?
    
    CALCULADORA: const x = 2;  // ← Preparar datos simples
    HOOK: const { result } = renderRegistroFormHook();  // ← Preparar hook de React
    
    DETALLES:
    - renderRegistroFormHook() ejecuta renderHook() internamente
    - Crea un componente React invisible para que el hook funcione
    - result.current contiene el valor actual del hook
    
    ANALOGÍA:
    Es como preparar un laboratorio antes de hacer un experimento
    */
    
    // ═══════════════════════════════════════════════════════════════
    // ACT - EJECUTAR LA ACCIÓN QUE QUEREMOS PROBAR
    // ═══════════════════════════════════════════════════════════════
    
    act(() => {
      const event = {
        target: { id: 'username', value: 'abc' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    /*
    ¿QUÉ HACE ESTO?
    
    CALCULADORA: const resultado = sumar(x, y);  // ← Llamada directa
    HOOK: act(() => { result.current.handleChange(event); });  // ← Simular evento
    
    DETALLES:
    1. Creamos un evento falso que simula escribir "abc" en el campo username
    2. Llamamos a handleChange() como lo haría un usuario real
    3. act() le dice a React: "procesa todos los cambios de estado ahora"
    
    ANALOGÍA:
    Es como simular que un usuario escribió "abc" en el campo de texto
    */
    
    // ═══════════════════════════════════════════════════════════════
    // ASSERT - VERIFICAR QUE EL RESULTADO SEA EL ESPERADO
    // ═══════════════════════════════════════════════════════════════
    
    // Verificación 1: El valor se guardó correctamente
    expect(result.current.formData.username).toBe('abc');
    /*
    CALCULADORA: expect(resultado).toBe(4);  // ← Verificar número
    HOOK: expect(result.current.formData.username).toBe('abc');  // ← Verificar string
    
    EXPLICACIÓN:
    - result.current: El estado actual del hook
    - formData.username: El campo username dentro del formulario
    - .toBe('abc'): Verificar que sea exactamente 'abc'
    */
    
    // Verificación 2: El mensaje de validación es correcto
    expect(result.current.validationMessages.username).toEqual({
      message: "✔ Nombre de usuario válido",
      className: 'text-success'
    });
    /*
    CALCULADORA: expect(resultado).toBe(4);  // ← Una verificación simple
    HOOK: expect(...).toEqual({ message: "...", className: "..." });  // ← Objeto completo
    
    EXPLICACIÓN:
    - validationMessages.username: El mensaje de validación para username
    - .toEqual(): Compara objetos completos (no solo valores primitivos)
    - Verificamos tanto el mensaje como la clase CSS
    */
  });

  // ===============================================================================
  // PARTE 7: MÁS EJEMPLOS DE PRUEBAS
  // ===============================================================================

  test('username con más de 3 caracteres debe ser válido', () => {
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act
    act(() => {
      const event = {
        target: { id: 'username', value: 'usuario_valido' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert
    expect(result.current.formData.username).toBe('usuario_valido');
    expect(result.current.validationMessages.username).toEqual({
      message: "✔ Nombre de usuario válido",
      className: 'text-success'
    });
  });

  test('username con 10 caracteres debe ser válido', () => {
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act
    act(() => {
      const event = {
        target: { id: 'username', value: 'abcdefghij' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert
    expect(result.current.formData.username).toBe('abcdefghij');
    expect(result.current.validationMessages.username).toEqual({
      message: "✔ Nombre de usuario válido",
      className: 'text-success'
    });
  });

  // ===============================================================================
  // PARTE 8: PRUEBAS DE CASOS DE ERROR
  // ===============================================================================

  test('username con 2 caracteres debe ser inválido', () => {
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act
    act(() => {
      const event = {
        target: { id: 'username', value: 'ab' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert
    expect(result.current.formData.username).toBe('ab');
    expect(result.current.validationMessages.username).toEqual({
      message: "✖ Debe tener al menos 3 caracteres",
      className: 'text-danger'
    });
    /*
    COMPARACIÓN CON CALCULADORA:
    
    CALCULADORA podría tener:
    test('dividir por cero debe dar error', () => {
      expect(() => dividir(4, 0)).toThrow('No se puede dividir por cero');
    });
    
    HOOK:
    test('username inválido debe mostrar error', () => {
      // ... código ...
      expect(result.current.validationMessages.username.className).toBe('text-danger');
    });
    
    ✅ AMBOS prueban casos de error, pero de formas diferentes
    */
  });

  test('username con 1 caracter debe ser inválido', () => {
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act
    act(() => {
      const event = {
        target: { id: 'username', value: 'a' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert
    expect(result.current.formData.username).toBe('a');
    expect(result.current.validationMessages.username).toEqual({
      message: "✖ Debe tener al menos 3 caracteres",
      className: 'text-danger'
    });
  });

  // ===============================================================================
  // PARTE 9: PRUEBAS DE CASOS LÍMITE
  // ===============================================================================

  test('username vacío no debe mostrar mensaje de validación', () => {
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act
    act(() => {
      const event = {
        target: { id: 'username', value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert
    expect(result.current.formData.username).toBe('');
    expect(result.current.validationMessages.username).toBeUndefined();
    /*
    .toBeUndefined() verifica que NO exista el mensaje de validación
    Esto replica la lógica del hook: if (username.length > 0) { ... }
    */
  });

  test('username con espacios y 3 caracteres debe ser válido', () => {
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act
    act(() => {
      const event = {
        target: { id: 'username', value: 'a b' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert
    expect(result.current.formData.username).toBe('a b');
    expect(result.current.validationMessages.username).toEqual({
      message: "✔ Nombre de usuario válido",
      className: 'text-success'
    });
  });

  test('username con caracteres especiales y 3 caracteres debe ser válido', () => {
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act
    act(() => {
      const event = {
        target: { id: 'username', value: 'a@b' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert
    expect(result.current.formData.username).toBe('a@b');
    expect(result.current.validationMessages.username).toEqual({
      message: "✔ Nombre de usuario válido",
      className: 'text-success'
    });
  });

  // ===============================================================================
  // PARTE 10: PRUEBAS DE TRANSICIONES (CAMBIOS DE ESTADO)
  // ===============================================================================

  test('debe cambiar de inválido a válido al agregar caracteres', () => {
    /*
    CALCULADORA no tiene "transiciones" porque las funciones son puras:
    sumar(2, 2) siempre da 4, no importa el historial
    
    HOOKS sí tienen transiciones porque manejan estado:
    username: '' → 'ab' → 'abc'
    validación: ninguna → error → éxito
    */
    
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act 1 - Primero username inválido
    act(() => {
      const event = {
        target: { id: 'username', value: 'ab' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert 1 - Verificar estado inválido
    expect(result.current.validationMessages.username?.className).toBe('text-danger');
    
    // Act 2 - Luego username válido
    act(() => {
      const event = {
        target: { id: 'username', value: 'abc' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert 2 - Verificar transición a válido
    expect(result.current.validationMessages.username?.className).toBe('text-success');
  });

  test('debe cambiar de válido a inválido al quitar caracteres', () => {
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act - Primero username válido
    act(() => {
      const event = {
        target: { id: 'username', value: 'abc' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert - Verificar estado válido
    expect(result.current.validationMessages.username?.className).toBe('text-success');
    
    // Act - Luego username inválido
    act(() => {
      const event = {
        target: { id: 'username', value: 'ab' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert - Verificar transición a inválido
    expect(result.current.validationMessages.username?.className).toBe('text-danger');
  });

  // ===============================================================================
  // PARTE 11: PRUEBAS DE INTEGRACIÓN CON EL HOOK COMPLETO
  // ===============================================================================

  test('debe marcar el formulario como touched cuando se interactúa', () => {
    /*
    CALCULADORA no tiene conceptos como "touched" porque no maneja estado
    HOOKS pueden tener lógica compleja de estado interno
    */
    
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Assert - Inicialmente no está touched
    expect(result.current.isFormTouched).toBe(false);
    
    // Act - Interactuar con el campo
    act(() => {
      const event = {
        target: { id: 'username', value: 'abc' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert - Ahora debe estar touched
    expect(result.current.isFormTouched).toBe(true);
  });

  test('debe mantener otros campos intactos al validar username', () => {
    // Arrange
    const { result } = renderRegistroFormHook();
    
    // Act - Cambiar username
    act(() => {
      const event = {
        target: { id: 'username', value: 'testuser' }
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleChange(event);
    });
    
    // Assert - Otros campos deben mantenerse en su estado inicial
    expect(result.current.formData.correo).toBe('');
    expect(result.current.formData.contrasena).toBe('');
    expect(result.current.formData.telefono).toBe('');
    expect(result.current.formData.direccion).toBe('');
  });

  test('debe sincronizar región y comuna desde props', () => {
    // Arrange - Renderizar con región y comuna específicas
    const { result } = renderRegistroFormHook('Metropolitana', 'Santiago');
    
    // Assert - Verificar que se sincronizaron correctamente
    expect(result.current.formData.region).toBe('Metropolitana');
    expect(result.current.formData.comuna).toBe('Santiago');
  });

});

// ===============================================================================
// PARTE 12: RESUMEN FINAL - COMPARACIÓN COMPLETA
// ===============================================================================

/*
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RESUMEN: CALCULADORA vs HOOK                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ CALCULADORA (Funciones Puras):                                             │
│ ├── Importaciones simples                                                   │
│ ├── Sin mocks                                                               │
│ ├── Sin helpers                                                             │
│ ├── Sin beforeEach                                                          │
│ ├── Arrange: preparar datos                                                 │
│ ├── Act: llamar función                                                     │
│ ├── Assert: verificar resultado                                             │
│ └── ✅ Simple, rápido, directo                                              │
│                                                                             │
│ HOOKS DE REACT (Estado + Efectos):                                         │
│ ├── Importaciones complejas (@testing-library/react)                       │
│ ├── Mocks para dependencias                                                 │
│ ├── Helpers para simplificar                                                │
│ ├── beforeEach para limpieza                                                │
│ ├── Arrange: renderizar hook                                                │
│ ├── Act: simular eventos con act()                                          │
│ ├── Assert: verificar estado y efectos                                      │
│ └── ⚙️ Complejo, pero más cercano a la realidad                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

🎯 CUÁNDO USAR CADA ENFOQUE:

CALCULADORA (Función Extraída):
✅ Lógica de negocio pura
✅ Sin dependencias de React
✅ Pruebas rápidas
✅ Fácil de debuggear

HOOK COMPLETO:
✅ Comportamiento real de la aplicación
✅ Detección de bugs de integración
✅ Pruebas de estado y efectos
✅ Cobertura más completa

🚀 COMANDOS PARA EJECUTAR:
npm run test User_Register.test\ copy.tsx
npm run test:watch
*/
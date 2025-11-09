/**
 * Define la estructura de un usuario en la base de datos simulada.
 */
// src/types/User.ts

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
export interface UsuarioSesion {
  username: string;
  rol: 'user' | 'admin';
  fotoPerfil?: string; 
}

/*
  Archivos que importan / usan los tipos definidos en `src/types/User.ts`:

  - src/utils/initUsers.ts
    Razón: usa `Usuario` para inicializar la base de datos simulada (`localStorage`) con
           la forma esperada de cada usuario (id, username, correo, rol, fotoPerfil, etc.).

  - src/pages/User_Login.tsx
    Razón: valida credenciales y mapea datos del formulario usando la forma de `Usuario`.

  - src/pages/UserPerfil.tsx
    Razón: muestra/edita los datos del usuario (perfil, foto, teléfono, dirección) usando `Usuario`.

  - src/pages/ProductShop.tsx
    Razón: importa `Usuario` para leer preferencias o estado de sesión y adaptar la UI (por ejemplo, descuentos visibles).

  - src/pages/Payment.tsx
    Razón: utiliza `Usuario` para mostrar información del comprador y calcular puntos/beneficios.

  - src/pages/admin/Admin_Users.tsx
    Razón: panel de administración que lista/edita usuarios; necesita el tipo `Usuario` para el CRUD.

  - src/pages/admin/Admin_Dashboard.tsx
    Razón: utiliza `UsuarioSesion` (versión ligera) para mostrar métricas y estadísticas relacionadas a usuarios.

  - src/components/ProductDestacados.tsx
    Razón: puede leer el usuario actual (`Usuario`) para aplicar reglas de visualización personalizadas (ej. descuentos).

  - src/components/Header.tsx
    Razón: usa `UsuarioSesion` para mostrar avatar, nombre y opciones del usuario en el header.

  - src/components/BannerBienvenida.tsx
    Razón: recibe `UsuarioSesion` para saludar al usuario actual con su `username` y foto.

  - src/hooks/Descuentos.ts
    Razón: toma `UsuarioSesion` o `Usuario` para decidir si aplica descuentos especiales según el rol o flags (ej. `descuentoDuoc`).

  - src/types/UserRegister.ts
    Razón: reutiliza `Usuario` en definiciones relacionadas al registro para mantener consistencia de tipos.


*/
/**
 * Define la estructura de un producto extraído de la base de datos simulada (productos.json).
 */
export interface Product { 
  codigo: string;
  nombre: string;
  imagen?: string;
  precio: number;
  fabricante?: string;
  distribuidor?: string;
  Marca?: string;
  Material?: string;
  Descripcion?: string;
  enlace?: string;
  categoria?: string;
  // Permite campos extra sin romper el tipado
  [key: string]: any;
}

// Opcional: Si necesitas un array de productos
export type Products = Product[];

/**
* Define la estructura de un comentario sobre un producto.
*/
export interface Comentario {
  usuario: string;
  calificacion: number; // 1..5
  texto: string;
  fecha: string; // ISO o formato legible
}

/*
  Archivos que importan/usan el tipo `Product` (lista de importaciones explícitas y por qué):

  - src/types/Cart.ts
    Razón: `CartItem` extiende `Product` para añadir la propiedad `cantidad` usada en el carrito.

  - src/pages/ProductShop.tsx
    Razón: Carga/castea los datos desde `src/data/productos.json` a `Product[]` y los muestra en la tienda.

  - src/pages/ProductDetail.tsx
    Razón: Mapea un `Product` seleccionado y muestra su información detallada (comentarios, imagen, etc.).

  - src/pages/admin/Admin_Products.tsx
    Razón: Vista de administración que edita/filtra/gestiona objetos `Product`.

  - src/hooks/UseProducts.tsx
    Razón: Hook que maneja la carga/guardado/edición de la lista de `Product` en localStorage.

  - src/hooks/UseCart.tsx
    Razón: Funciones para añadir/quitar productos del carrito usan `Product` como entrada.

  - src/hooks/Descuentos.ts
    Razón: Calcula descuentos o etiquetas en base a las propiedades de un `Product`.

  - src/components/ProductFormModal.tsx
    Razón: Formulario para añadir/editar `Product` (usa `Omit<Product,'codigo'>` para entradas nuevas).

  - src/components/ProductDestacados.tsx
    Razón: Selecciona y renderiza un array de `Product` como destacados en la UI.

  - src/components/ProductCard.tsx
    Razón: Componente visual que recibe un `Product` y muestra su tarjeta/imagen/precio.

  - src/components/Header.tsx
    Razón: Usa `Product[]` para construir menús o sugerencias rápidas en el header.

  - src/components/CartItem.tsx
    Razón: Renderiza un ítem del carrito basado en `CartItem` (derivado de `Product`).
*/
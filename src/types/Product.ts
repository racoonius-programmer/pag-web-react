/**
 * Define la estructura de un producto extraído de la base de datos simulada (productos.json).
 */
export interface Producto {
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

export type Productos = Producto[];

/**
 * Define la estructura de un comentario sobre un producto.
 */
export interface Comentario {
  usuario: string;
  calificacion: number; // 1..5
  texto: string;
  fecha: string; // ISO o formato legible
}
/**
 * Define la estructura de un producto extraído de la base de datos simulada (productos.json).
 */
export interface Producto {
  codigo: string;
  nombre: string;
  imagen: string;
  precio: number;
  fabricante: string;
  distribuidor: string;
  Marca: string;
  Material: string;
  Descripcion: string;
  enlace: string;
  categoria: 
    | "figuras"
    | "juegos_de_mesa"
    | "accesorios"
    | "consolas"
    | "pc_gamer"
    | "sillas_gamer"
    | "mouse"
    | "mousepad"
    | "poleras_personalizadas";
}
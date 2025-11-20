/**
 * Tipo que representa un producto dentro de un pedido
 * - `codigo` hace referencia al identificador del producto (string)
 * - `cantidad` es la cantidad pedida
 * - `precio` captura el precio unitario en el momento del pedido (para historial)
 */
export interface PedidoProducto {
  codigo: string;
  nombre?: string;
  cantidad: number;
  precio: number;
  // Posible campo extra (ej. variantes)
  [key: string]: any;
}

/**
 * Estructura del objeto Pedido preparada para una API real
 * - `id` : clave primaria numérica del pedido (asumido por el servidor)
 * - `fecha` : ISO string con la fecha/hora del pedido
 * - `clienteId` : id del usuario que hizo el pedido (numérico)
 * - `productos` : array de `PedidoProducto`
 * - `estado` : estado del pedido (strings en español tal como lo solicitaste)
 * - `total` : suma calculada del pedido (opcional, puede ser calculada por cliente o servidor)
 */
export type PedidoEstado = 'en preparacion' | 'entregado';

export interface Pedido {
  id: number;
  fecha: string; // ISO 8601
  clienteId: number;
  productos: PedidoProducto[];
  estado: PedidoEstado;
  total?: number;
  // metadatos opcionales (dirección, notas, etc.)
  [key: string]: any;
}

// Payload usado al crear un pedido: el servidor típicamente setea id y fecha
export type PedidoPayload = Omit<Pedido, 'id' | 'fecha' | 'total'>;

// No default export (tipos). Importar con: import { Pedido, PedidoProducto, PedidoPayload } from '../types/Pedido'

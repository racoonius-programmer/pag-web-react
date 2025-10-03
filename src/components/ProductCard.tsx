// src/components/ProductoCard.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../types/Product';
// Importamos UsuarioSesion para tipificar el usuario logueado
import type { UsuarioSesion } from '../types/User'; 

// --- LÓGICA DE PRECIO FINAL (Migrada desde Vanilla JS) ---

/**
 * Retorna el precio final de un producto, aplicando descuento si el usuario está
 * logueado y cumple las condiciones (ej: correo @duoc.cl o propiedad descuentoDuoc).
 * @param producto El objeto del producto.
 * @returns Un objeto con el precio final y un booleano que indica si se aplicó descuento.
 */
const calcularPrecioFinal = (producto: Producto) => {
    // Nota: El tipo UsuarioSesion en el header solo tiene {username, rol, fotoPerfil}.
    // Para la lógica de descuento, necesitamos cargar el objeto completo UsuarioDB si existe.
    // Asumiremos que el objeto 'usuarioActual' en localStorage tiene la propiedad necesaria.
    
    const usuarioActualJSON = localStorage.getItem('usuarioActual');
    const usuario: UsuarioSesion | undefined = usuarioActualJSON ? JSON.parse(usuarioActualJSON) : undefined;
    
    // La condición de descuento es simplificada aquí, ya que 'usuarioActual' puede no
    // tener 'correo' o 'descuentoDuoc'. En React, esta lógica idealmente viviría
    // en un contexto o hook de autenticación. Aquí usamos la propiedad `rol` para una simulación simple.
    // Usaremos el rol 'usuario' si el nombre contiene "duoc" para simular la verificación Duoc, 
    // ya que UsuarioSesion no tiene `correo` o `descuentoDuoc`.
    const tieneDescuento = usuario && usuario.rol === 'user' && usuario.username.toLowerCase().includes('duoc');
    
    const precioBase = producto.precio;
    const precioFinal = tieneDescuento ? Math.round(precioBase * 0.8) : precioBase;
    
    return { precioFinal, tieneDescuento };
};


// --- COMPONENTE DE TARJETA ---

interface ProductoCardProps {
    producto: Producto;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
    
    const { precioFinal, tieneDescuento } = useMemo(() => calcularPrecioFinal(producto), [producto]);

    // La ruta de detalle del producto debe ser dinámica
    const detailPath = `/productos/${producto.codigo}`;

    return (
        <div className="col-md-4 mb-4">
            {/* Usamos Link de React Router en lugar de <a> con href */}
            <Link to={detailPath} className="card-link text-decoration-none">
                <div className="card h-100 d-flex flex-column bg-dark text-light border-secondary">
                    <img 
                        className="card-img-top padding_top rounded w-100 p-3" 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        style={{ objectFit: 'cover', height: '200px' }} // Estilos para consistencia
                    />
                    <div className="card-body d-flex flex-column">
                        <h4 className="card-title text-white">{producto.nombre}</h4>
                        <p className="card-text text-secondary roboto fs-6">
                            Código: {producto.codigo} <br />
                            Fabricante: {producto.fabricante} <br />
                            Distribuidor: {producto.distribuidor}
                        </p>
                        <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                            {/* Aquí puedes añadir un botón de "Ver más" si el Link no cubre toda la tarjeta */}
                            <Link to={detailPath} className="btn btn-outline-primary">Ver Detalle</Link>
                            
                            <div style={{ backgroundColor: '#1E90FF' }} className="btn text-white fw-bold">
                                {/* Formato de moneda con toLocaleString */}
                                ${precioFinal.toLocaleString('es-ES')}
                                {tieneDescuento && (
                                    <small className="text-warning fw-normal ms-2">(-20%)</small>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductoCard;
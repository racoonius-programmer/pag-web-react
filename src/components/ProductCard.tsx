import React from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../types/Product';

import { usarDescuento } from '../hooks/Descuentos'; 

interface ProductoCardProps {
    producto: Producto;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
    
    const { precioFinal, tieneDescuento } = usarDescuento(producto);

    // La ruta de detalle del producto es dinamica segun el codigo del producto
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
                        style={{ objectFit: 'cover', height: '400px' }}
                    />
                    <div className="card-body d-flex flex-column">
                        <h4 className="card-title text-white">{producto.nombre}</h4>
                        <p className="card-text text-secondary roboto fs-6">
                            Código: {producto.codigo} <br />
                            Fabricante: {producto.fabricante} <br />
                            Distribuidor: {producto.distribuidor}
                        </p>
                        <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                            {/* Botón Ver Detalle */}
                            <Link to={detailPath} className="btn btn-outline-primary">Ver Detalle</Link>
                            
                            <div style={{ backgroundColor: '#1E90FF' }} className="btn text-white fw-bold">
                                {/* Muestra el precio final calculado por el Hook */}
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
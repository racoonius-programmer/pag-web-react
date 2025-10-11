
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types/Product';
import { usarDescuento } from '../hooks/Descuentos';
import { useCartContext } from '../hooks/UseCart';

interface ProductoCardProps {
    producto: Product;
}

const ProductoCard: React.FC<ProductoCardProps> = ({ producto }) => {
    const { precioFinal, tieneDescuento } = usarDescuento(producto);
    const { addToCart } = useCartContext();
    const navigate = useNavigate();
    const detailPath = `/productos/${producto.codigo}`;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(producto, 1);
        navigate('/carrito');
    };

    return (
        <Link to={detailPath} className="card-link text-decoration-none">
            <div className="card h-100 d-flex flex-column bg-dark text-light border-secondary" style={{ minWidth: '270px', maxWidth: '320px', height: '420px' }}>
                <div style={{ width: '100%', height: '180px', background: '#222', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                    <img 
                        src={producto.imagen} 
                        alt={producto.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                    />
                </div>
                <div className="card-body d-flex flex-column" style={{ flex: 1 }}>
                    <h4 className="card-title text-white" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{producto.nombre}</h4>
                    <p className="card-text text-secondary roboto fs-6" style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        Código: {producto.codigo} <br />
                        Fabricante: {producto.fabricante} <br />
                        Distribuidor: {producto.distribuidor}
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
                        <Link to={detailPath} className="btn btn-outline-primary">Ver Detalle</Link>
                        <div style={{ backgroundColor: '#1E90FF' }} className="btn text-white fw-bold">
                            ${precioFinal.toLocaleString('es-ES')}
                            {tieneDescuento && (
                                <small className="text-warning fw-normal ms-2">(-20%)</small>
                            )}
                        </div>
                    </div>
                    <button className="btn btn-success mt-3 w-100" onClick={handleAddToCart}>
                        <i className="bi bi-cart-plus me-2"></i> Añadir al Carrito y ver carrito
                    </button>
                </div>
            </div>
        </Link>
    );
}

export default ProductoCard;
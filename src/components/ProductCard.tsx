import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Producto } from '../types/Product';

interface Props {
  producto: Producto;
}

const ProductCard: React.FC<Props> = ({ producto }) => {
  const navigate = useNavigate();

  return (
    <div className="col-md-4 mb-4">
      {/* Un único Link que envuelve toda la tarjeta */}
      <Link to={`/productos/${producto.codigo}`} className="text-decoration-none text-reset">
        <div className="card h-100">
          {producto.imagen && (
            <img src={producto.imagen} className="card-img-top" alt={producto.nombre} />
          )}
          <div className="card-body">
            <h5 className="card-title">{producto.nombre}</h5>
            {producto.Descripcion && <p className="card-text">{producto.Descripcion}</p>}
          </div>
          <div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center">
            <small className="text-muted">Código: {producto.codigo}</small>
            {/* Botón interno NO es un <a>, evita anidar enlaces */}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={(e) => {
                // evita que el click del botón se propague si quieres comportamiento distinto
                e.stopPropagation();
                // navegar manualmente si prefieres (opcional)
                navigate(`/productos/${producto.codigo}`);
              }}
            >
              Ver más
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
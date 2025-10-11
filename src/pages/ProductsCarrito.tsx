import React from 'react';
import { useCartContext } from '../hooks/UseCart';
import CartItemComponent from '../components/CartItem';
import { useNavigate } from 'react-router-dom';

const ProductoCarrito: React.FC = () => {
  const { cart, totalAmount, clearCart } = useCartContext();
  const navigate = useNavigate();

  // Forzar actualización del carrito al montar la página
  React.useEffect(() => {
    window.dispatchEvent(new Event('storage'));
  }, []);

  return (
    <div className="container bg-dark text-white py-5 flex-grow-1">
      <h1 className="mb-4">Mi Carrito</h1>
      {cart.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="mb-4">
            {cart.map(item => (
              <CartItemComponent key={item.codigo} item={item} />
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="fs-4 fw-bold">Total: ${totalAmount.toLocaleString('es-ES')}</span>
            <button className="btn btn-danger" onClick={clearCart}>Vaciar carrito</button>
          </div>
          <div className="d-grid gap-2">
            <button className="btn btn-success btn-lg" onClick={() => navigate('/payment')}>
              Pagar y finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductoCarrito;
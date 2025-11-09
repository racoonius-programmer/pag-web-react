import React from 'react';
import { useCartContext } from '../hooks/UseCart';
import CartItemComponent from '../components/CartItem';
import { useNavigate } from 'react-router-dom';

const ProductoCarrito: React.FC = () => {
  /*
    Página: ProductosCarrito
    -------------------------
    Muestra los items actualmente en el carrito (obtenidos desde el contexto `useCartContext`).

    Funcionalidades principales:
    - Mostrar lista de `CartItemComponent` para cada producto en `cart`.
    - Mostrar el `totalAmount` calculado por el contexto.
    - Permitir vaciar el carrito con `clearCart()`.
    - Botón para navegar a la ruta de pago (`/payment`).

    Notas:
    - El componente no guarda localmente el carrito; consume el `CartContext`.
    - Se fuerza un evento `storage` al montar para forzar re-render desde listeners externos
      que puedan sincronizar el estado del carrito (patrón usado en este proyecto).
  */
  const { cart, totalAmount, clearCart } = useCartContext();
  const navigate = useNavigate();

  // Forzar actualización del carrito al montar la página. Esto dispara cualquier
  // listener que haya registrado la app para cambios en localStorage/estado.
  React.useEffect(() => {
    window.dispatchEvent(new Event('storage'));
  }, []);

  return (
    <div className="container bg-dark text-white py-5 flex-grow-1">
      <h1 className="mb-4">Mi Carrito</h1>

      {/* Si el carrito está vacío mostramos un mensaje amable */}
      {cart.length === 0 ? (
        <p className="text-center">Tu carrito está vacío.</p>
      ) : (
        <>
          {/* Lista de items: CartItemComponent gestiona la UI de cada fila */}
          <div className="mb-4">
            {cart.map(item => (
              <CartItemComponent key={item.codigo} item={item} />
            ))}
          </div>

          {/* Resumen y acción: total y vaciar carrito */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="fs-4 fw-bold">Total: ${totalAmount.toLocaleString('es-ES')}</span>
            <button className="btn btn-danger" onClick={clearCart}>Vaciar carrito</button>
          </div>

          {/* CTA principal: navegar al flujo de pago */}
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

/*
  Archivos que importan / usan `ProductoCarrito` (y por qué):
  - `src/App.tsx`:
      - Monta esta página en la ruta `/carrito` para que el usuario pueda ver y
        gestionar su carrito.

  - `src/components/Header.tsx` y `src/components/BannerBienvenida.tsx`:
      - Contienen enlaces (`<Link to="/carrito">`) que llevan a esta página.

  - `src/pages/Payment.tsx`:
      - Navega hacia `/carrito` en ciertos flujos (por ejemplo, al cancelar o volver)
        y `Payment` también recibe el contexto del carrito.

  - `src/components/ProductCard.tsx` / `src/pages/ProductDetail.tsx`:
      - Desde la vista de producto se puede navegar o añadir al carrito y luego
        revisar el contenido aquí.
*/
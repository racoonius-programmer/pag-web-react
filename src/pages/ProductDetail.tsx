import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productosData from '../data/productos.json';
import type { Producto, Comentario } from '../types/Product';

const ProductDetail: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();

  const productos: Producto[] = (productosData as any).productos || (productosData as any);

  const producto = productos.find((p) => p.codigo === codigo);

  const [cantidad, setCantidad] = useState<number>(1);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  useEffect(() => {
    if (producto && Array.isArray(producto.comentarios)) {
      setComentarios(producto.comentarios as Comentario[]);
    } else {
      // fallback: comentarios de ejemplo (opcional)
      setComentarios([
        { usuario: 'María López', calificacion: 5, texto: 'Excelente producto.', fecha: '2025-09-04' },
      ]);
    }
  }, [producto]);

  const [score, setScore] = useState<number | ''>('');
  const [commentText, setCommentText] = useState<string>('');

  useEffect(() => {
    if (producto) {
      document.title = `${producto.nombre} - Detalle del Producto`;
    } else {
      document.title = 'Producto no encontrado';
    }
  }, [producto]);

  if (!producto) {
    return (
      <div className="container py-5 text-center text-white">
        <h2>Producto no encontrado.</h2>
      </div>
    );
  }

  const usuarioLogueado = (() => {
    try {
      return JSON.parse(localStorage.getItem('usuarioActual') || 'null');
    } catch {
      return null;
    }
  })();

  const esDuoc = !!(usuarioLogueado && usuarioLogueado.descuentoDuoc === true);
  const precioOriginal = producto.precio || 0;
  const precioFinal = esDuoc ? Math.round(precioOriginal * 0.8) : precioOriginal;

  const decrease = () => setCantidad((q) => Math.max(1, q - 1));
  const increase = () => setCantidad((q) => q + 1);

  const agregarAlCarrito = () => {
    if (!usuarioLogueado) {
      navigate('/login');
      return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]') as any[];
    const index = carrito.findIndex((item) => item.codigo === producto.codigo);
    if (index !== -1) {
      carrito[index].cantidad = (carrito[index].cantidad || 0) + cantidad;
    } else {
      carrito.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: precioFinal,
        imagen: producto.imagen,
        Descripcion: producto.Descripcion,
        Material: producto.Material,
        cantidad,
      });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    navigate('/carrito');
  };

  const addToWishlist = () => {
    if (!usuarioLogueado) {
      navigate('/login');
      return;
    }
    // Simulado: podría guardarse en localStorage bajo 'wishlist'
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]') as any[];
    if (!wishlist.find((p) => p.codigo === producto.codigo)) {
      wishlist.push({ codigo: producto.codigo, nombre: producto.nombre, imagen: producto.imagen });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    // Mensaje simple
    alert(`¡${producto.nombre} añadido a la lista de deseos!`);
  };

  const renderizarComentarios = () =>
    comentarios.map((c, i) => (
      <div key={i} className="list-group-item list-group-item-dark mb-3 rounded">
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1 text-warning">{'★'.repeat(c.calificacion) + '☆'.repeat(5 - c.calificacion)}</h5>
          <small>— {c.usuario} ({c.fecha})</small>
        </div>
        <p className="mb-1">{c.texto}</p>
      </div>
    ));

  const submitComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || commentText.trim() === '') {
      alert('Por favor, selecciona una puntuación y escribe un comentario.');
      return;
    }
    const nuevo: Comentario = {
      usuario: usuarioLogueado ? usuarioLogueado.username || 'Usuario' : 'Usuario Anónimo',
      calificacion: Number(score),
      texto: commentText.trim(),
      fecha: new Date().toLocaleDateString('es-CL'),
    };
    setComentarios((prev) => [nuevo, ...prev]);
    setScore('');
    setCommentText('');
    alert('¡Tu reseña ha sido enviada!');
  };

  return (
    <div className="container py-5 text-white">
      <div className="row">
        <div className="col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
        </div>

        <div className="col-md-6">
          {producto.Marca && <small>{producto.Marca}</small>}
          <h1 className="mt-2">{producto.nombre}</h1>
          <p>Código: {producto.codigo}</p>
          {producto.Material && <p>Material: {producto.Material}</p>}
          {producto.Descripcion && <p>{producto.Descripcion}</p>}

          <div className="mb-3">
            {esDuoc ? (
              <>
                <h6>
                  <span className="text-decoration-line-through text-danger">
                    ${precioOriginal.toLocaleString('es-ES')}
                  </span>
                </h6>
                <h2>
                  <span className="ms-2 text-success fw-bold">Precio DUOC: ${precioFinal.toLocaleString('es-ES')}</span>
                </h2>
              </>
            ) : (
              <h2>${precioOriginal.toLocaleString('es-ES')}</h2>
            )}
          </div>

          <div className="d-flex my-4">
            <div className="input-group me-3" style={{ width: 130 }}>
              <button type="button" className="btn btn-primary" onClick={decrease}>-</button>
              <input
                type="text"
                className="form-control text-center"
                value={cantidad}
                readOnly
                aria-label="cantidad"
              />
              <button type="button" className="btn btn-primary" onClick={increase}>+</button>
            </div>

            <button type="button" className="btn btn-primary flex-grow-1" onClick={agregarAlCarrito}>
              AÑADIR Y VER CARRITO
            </button>
          </div>

          <div className="d-grid">
            <button type="button" className="btn btn-outline-light" onClick={addToWishlist}>
              Añadir a la lista de deseos
            </button>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <h3 className="text-center mb-4">Deja tu reseña</h3>
        <form id="commentForm" onSubmit={submitComentario}>
          <div className="mb-3">
            <label htmlFor="reviewScore" className="form-label">Calificación</label>
            <select
              id="reviewScore"
              className="form-select"
              value={score}
              onChange={(e) => setScore(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="" disabled>Elige una puntuación</option>
              <option value={1}>1 Estrella</option>
              <option value={2}>2 Estrellas</option>
              <option value={3}>3 Estrellas</option>
              <option value={4}>4 Estrellas</option>
              <option value={5}>5 Estrellas</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="commentText" className="form-label">Comentario</label>
            <textarea
              id="commentText"
              className="form-control"
              rows={4}
              placeholder="Escribe tu comentario aquí..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Enviar Reseña</button>
          </div>
        </form>

        <hr className="my-5" />
        <h4>Comentarios de los clientes</h4>
        <div id="commentsContainer" className="list-group">
          {renderizarComentarios()}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

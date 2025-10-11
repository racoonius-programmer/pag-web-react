import React, { useEffect, useState } from 'react';
import { useCartContext } from '../hooks/UseCart';
import { useNavigate } from 'react-router-dom';
import type { Usuario } from '../types/User';

const Payment: React.FC = () => {
	const { cart, totalAmount, clearCart } = useCartContext();
	const [usuario, setUsuario] = useState<Usuario | null>(null);
	const [puntosGanados, setPuntosGanados] = useState(0);
	const [valorPuntos, setValorPuntos] = useState(0);
	const [mensaje, setMensaje] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Obtener usuario actual de localStorage
		try {
			const usuarioActual = localStorage.getItem('usuarioActual');
			setUsuario(usuarioActual ? JSON.parse(usuarioActual) : null);
		} catch {
			setUsuario(null);
		}
		// Calcular puntos
		const puntos = Math.floor(totalAmount / 100);
		setPuntosGanados(puntos);
		setValorPuntos(puntos * 10);
	}, [totalAmount]);

	const procesarPago = () => {
		if (!usuario) {
			setMensaje('Debes iniciar sesión para completar tu compra.');
			setTimeout(() => navigate('/login'), 2000);
			return;
		}
		if (cart.length === 0) {
			setMensaje('Tu carrito está vacío.');
			setTimeout(() => navigate('/carrito'), 2000);
			return;
		}
		// Sumar puntos al usuario
		let puntosActuales = parseInt(localStorage.getItem('puntosLevelUp') || '0', 10);
		puntosActuales += puntosGanados;
		localStorage.setItem('puntosLevelUp', puntosActuales.toString());
		// Vaciar carrito
		clearCart();
		// Generar código de envío
		const codigoEnvio = Math.floor(100000 + Math.random() * 900000);
		// Mensaje final
		setMensaje(
			`✅ ¡Pago realizado con éxito, ${usuario.username}!\n` +
			`Tu pedido será enviado a la dirección: ${usuario.direccion || 'Dirección no registrada.'}.\n` +
			`Código de envío: #${codigoEnvio}.\n\n` +
			`Ganaste ${puntosGanados} puntos. Ahora tienes un total de ${puntosActuales} puntos Level Up.`
		);
	};

	return (
		<div className="container py-5 text-white">
			<h1 className="mb-4">💳 Pago</h1>
			<div className="bg-dark p-4 rounded mb-4" id="resumenPago">
				{cart.length === 0 ? (
					<p>Tu carrito está vacío, no puedes pagar. <button className="btn btn-primary ms-2" onClick={() => navigate('/productos')}>Ir a Productos</button></p>
				) : (
					<>
						<h3>Resumen de Compra</h3>
						<p><strong>Total a Pagar:</strong> ${totalAmount.toLocaleString('es-ES')}</p>
						<p><strong>Puntos a ganar:</strong> {puntosGanados} puntos (equivalen a ${valorPuntos.toLocaleString('es-ES')})</p>
					</>
				)}
			</div>
			<hr />
			{mensaje && (
				<div className="alert alert-success text-dark" role="alert" style={{ whiteSpace: 'pre-line' }}>{mensaje}</div>
			)}
			<button className="btn btn-success" onClick={procesarPago} disabled={cart.length === 0 || !!mensaje}>
				✅ Confirmar Pago
			</button>
			<button className="btn btn-secondary ms-2" onClick={() => navigate('/carrito')}>⬅️ Volver al carrito</button>
			{mensaje && (
				<div className="mt-4 d-flex gap-2">
					<button className="btn btn-primary" onClick={() => navigate('/productos')}>Ir a productos</button>
					<button className="btn btn-outline-light" onClick={() => navigate('/')}>Ir al inicio</button>
				</div>
			)}
		</div>
	);
};

export default Payment;

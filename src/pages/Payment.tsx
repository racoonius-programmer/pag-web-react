import React, { useEffect, useState } from 'react';
import { useCartContext } from '../hooks/UseCart';
import { useNavigate } from 'react-router-dom';
import type { Usuario } from '../types/User';

/*
	Página: Payment
	Responsable de mostrar el resumen de compra y procesar un pago simulado.
*/

const Payment: React.FC = () => {
	// Obtenemos contexto del carrito (cart, totalAmount, clearCart).
	// `useCartContext` viene de `src/hooks/UseCart.tsx` y expone la lógica del carrito.
	const { cart, totalAmount, clearCart } = useCartContext();

	// `usuario` contiene la info del usuario actual (si existe) cargada desde localStorage.
	const [usuario, setUsuario] = useState<Usuario | null>(null);

	// `puntosGanados` se calcula a partir del total (por ejemplo: 1 punto cada 100 de gasto).
	const [puntosGanados, setPuntosGanados] = useState(0);

	// `valorPuntos` es una conversión monetaria de los puntos (aquí: 1 punto = $10).
	const [valorPuntos, setValorPuntos] = useState(0);

	// `mensaje` muestra mensajes al usuario (éxito, error, o avisos) y se muestra en un alert.
	const [mensaje, setMensaje] = useState<string | null>(null);

	// `navigate` se usa para redirigir a otras rutas (login, carrito, productos, inicio).
	const navigate = useNavigate();

	// Efecto: al cambiar `totalAmount` recalculamos puntos y cargamos el usuario desde localStorage.
	useEffect(() => {
		// Intentamos leer `usuarioActual` desde localStorage. Si no existe o la lectura falla,
		// dejamos `usuario` en null.
		try {
			const usuarioActual = localStorage.getItem('usuarioActual');
			setUsuario(usuarioActual ? JSON.parse(usuarioActual) : null);
		} catch {
			setUsuario(null);
		}

		// Lógica simple para calcular puntos: 1 punto por cada 100 en el total.
		const puntos = Math.floor(totalAmount / 100);
		setPuntosGanados(puntos);
		// En este sistema, cada punto vale $10 (esto es arbitrario y configurable).
		setValorPuntos(puntos * 10);
	}, [totalAmount]);

	/*
		procesarPago:
		- Verifica que el usuario esté logueado, que haya artículos en el carrito.
		- Suma los `puntosGanados` al contador global almacenado en localStorage ('puntosLevelUp').
		- Limpia el carrito usando `clearCart()` del contexto.
		- Genera un código de envío aleatorio y construye un mensaje de confirmación
			que incluye usuario, dirección y puntos ganados.
		- No realiza llamadas a un backend real
	*/
	const procesarPago = () => {
		if (!usuario) {
			// Si no hay usuario, mostramos mensaje y redirigimos al login en 2s.
			setMensaje('Debes iniciar sesión para completar tu compra.');
			setTimeout(() => navigate('/login'), 2000);
			return;
		}
		if (cart.length === 0) {
			// Si el carrito está vacío, avisamos y redirigimos al carrito.
			setMensaje('Tu carrito está vacío.');
			setTimeout(() => navigate('/carrito'), 2000);
			return;
		}

		// Sumamos puntos al usuario en localStorage (clave: 'puntosLevelUp').
		let puntosActuales = parseInt(localStorage.getItem('puntosLevelUp') || '0', 10);
		puntosActuales += puntosGanados;
		localStorage.setItem('puntosLevelUp', puntosActuales.toString());

		// Vaciar el carrito mediante la función del contexto.
		clearCart();

		// Generar un código de envío aleatorio para mostrar al usuario.
		const codigoEnvio = Math.floor(100000 + Math.random() * 900000);

		// Construir el mensaje final (usamos `whiteSpace: 'pre-line'` en el alert para respetar saltos de línea).
		setMensaje(
			`✅ ¡Pago realizado con éxito, ${usuario.username}!\n` +
			`Tu pedido será enviado a la dirección: ${usuario.direccion || 'Dirección no registrada.'}.\n` +
			`Código de envío: #${codigoEnvio}.\n\n` +
			`Ganaste ${puntosGanados} puntos. Ahora tienes un total de ${puntosActuales} puntos Level Up.`
		);
	};

	// JSX: resumen y acciones disponibles para el usuario.
	// - Si el carrito está vacío, mostramos una indicacion para ir a productos.
	// - Si hay artículos, mostramos total y puntos a ganar.
	return (
		<div className="container py-5 text-white">
			<h1 className="mb-4">💳 Pago</h1>
			<div className="bg-dark p-4 rounded mb-4" id="resumenPago">
				{cart.length === 0 ? (
					// Carrito vacío: sugerimos al usuario volver a productos.
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
			{/* Mensaje de resultado (éxito/estado) se muestra si `mensaje` no es null */}
			{mensaje && (
				<div className="alert alert-success text-dark" role="alert" style={{ whiteSpace: 'pre-line' }}>{mensaje}</div>
			)}

			{/* Botón principal para procesar el pago. Se deshabilita si no hay items o si ya hay un mensaje mostrado. */}
			<button className="btn btn-success" onClick={procesarPago} disabled={cart.length === 0 || !!mensaje}>
				✅ Confirmar Pago
			</button>
			<button className="btn btn-secondary ms-2" onClick={() => navigate('/carrito')}>⬅️ Volver al carrito</button>

			{/* Si hay mensaje, mostramos CTAs adicionales */}
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

/*
	Archivos que importan / usan `Payment` (y por qué):
	- `src/App.tsx`:
			- Monta `Payment` en la ruta `/payment` para que el usuario pueda completar
				el proceso de pago después de revisar su carrito.

	- `src/pages/ProductsCarrito.tsx`:
			- Contiene un botón que navega a `/payment` para iniciar el flujo de pago.

	- `src/hooks/UseCart.tsx`:
			- `Payment` consume el contexto del carrito (`useCartContext`) para obtener
				`cart`, `totalAmount` y `clearCart`.
*/

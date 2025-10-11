import React, { useState } from 'react';
import Modal from '../components/Modal';
import { useRegionesComunas } from '../hooks/RegionesComunas';

// Las variables regiones y comunasPorRegion han sido eliminadas ya que se gestionan con el hook useRegionesComunas.


const UserPerfil: React.FC = () => {
	const [username, setUsername] = useState('');
	const [correo, setCorreo] = useState('');
	const [fecha, setFecha] = useState('');
	const [telefono, setTelefono] = useState('');
		// Usar hook para regiones y comunas
		const {
			regionesOptions,
			comunasOptions,
			selectedRegion,
			selectedComuna,
			handleRegionChange,
			handleComunaChange,
		} = useRegionesComunas('', '');
	const [direccion, setDireccion] = useState('');
	const [fotoUrl, setFotoUrl] = useState('img/header/user-logo-generic-white-alt.png');
	const [avisoUsername, setAvisoUsername] = useState('');
	const [avisoFecha, setAvisoFecha] = useState('');
	const [avisoTelefono, setAvisoTelefono] = useState('');
	const [avisoDireccion, setAvisoDireccion] = useState('');

	// Cargar datos del usuario iniciado al montar
		React.useEffect(() => {
			try {
				const usuarioActual = localStorage.getItem('usuarioActual');
				if (usuarioActual) {
					const usuario = JSON.parse(usuarioActual);
					setUsername(usuario.username || '');
					setCorreo(usuario.correo || '');
					// Formato yyyy-MM-dd para input type date
					if (usuario.fecha) {
						const fechaISO = usuario.fecha.length > 10 ? usuario.fecha.slice(0, 10) : usuario.fecha;
						setFecha(fechaISO);
					}
					setTelefono(usuario.telefono || '');
					handleRegionChange(usuario.region || '');
					handleComunaChange(usuario.comuna || '');
					setDireccion(usuario.direccion || '');
					setFotoUrl(usuario.fotoUrl || 'img/header/user-logo-generic-white-alt.png');
				}
			} catch {
				// Si hay error, no hace nada
			}
		}, [handleRegionChange, handleComunaChange]);


		// Modal para guardar cambios
		const [showModal, setShowModal] = useState(false);
		const [modalMsg, setModalMsg] = useState('');

		const handleGuardar = () => {
			// Validaciones simples
			if (!username) setAvisoUsername('El nombre de usuario es obligatorio.'); else setAvisoUsername('');
			if (!fecha) setAvisoFecha('La fecha de nacimiento es obligatoria.'); else setAvisoFecha('');
			if (!direccion) setAvisoDireccion('La dirección es obligatoria.'); else setAvisoDireccion('');
			// Teléfono opcional
			if (telefono && !/^\d{1,2}\s?\d{4}\s?\d{4}$/.test(telefono)) setAvisoTelefono('Formato de teléfono inválido.'); else setAvisoTelefono('');
			// Aquí podrías guardar los datos en localStorage o enviarlos a una API
			if (username && fecha && direccion && (!telefono || avisoTelefono === '')) {
				// Guardar cambios en localStorage
				const usuarioActualizado = {
					username,
					correo,
					fecha,
					telefono,
					region: selectedRegion,
					comuna: selectedComuna,
					direccion,
					fotoUrl,
				};
				localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
				setModalMsg('¡Cambios guardados correctamente!');
				setShowModal(true);
			}
		};

	return (
		<div className="container p-5">
			<h2 className="text-light text-center mb-4">Mi Perfil</h2>
			<div className="card p-4 bg-dark text-light">
				<div className="text-center mb-4">
					<img src={fotoUrl} alt="Foto de perfil" className="rounded-circle" width={120} height={120} />
				</div>
				<form>
					<div className="mb-3">
						<label htmlFor="username" className="form-label text-light">Nombre de usuario:</label>
						<input type="text" required id="username" className="form-control" name="username"
							placeholder="Introduzca un nombre de usuario" maxLength={100}
							value={username} onChange={e => setUsername(e.target.value)} />
						<div id="aviso-username" className="mt-1 small text-danger">{avisoUsername}</div>
					</div>
					<div className="mb-3">
						<label htmlFor="correo" className="form-label">Correo:</label>
						<input type="email" className="form-control" id="correo" value={correo} disabled />
					</div>
					<div className="mb-3">
						<label htmlFor="fecha" className="form-label text-light">Fecha de Nacimiento:</label>
						<input type="date" className="form-control" id="fecha" name="fecha" required value={fecha} onChange={e => setFecha(e.target.value)} />
						<p id="aviso-fecha" className="mt-1 small text-danger">{avisoFecha}</p>
					</div>
					<div className="mb-3">
						<label htmlFor="telefono" className="form-label text-light">Teléfono (opcional):</label>
						<input type="text" id="telefono" className="form-control" name="telefono" placeholder="Ej: 9 1234 5678"
							maxLength={12} value={telefono} onChange={e => setTelefono(e.target.value)} />
						<div id="aviso-telefono" className="mt-1 small text-muted">{avisoTelefono}</div>
					</div>
								<div className="row">
									<div className="col-md-6 mb-3">
										<label htmlFor="elegirRegion" className="form-label text-light">Región</label>
										<select id="elegirRegion" className="form-select" value={selectedRegion} onChange={e => handleRegionChange(e.target.value)}>
											<option value="">Seleccione región...</option>
											{regionesOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
										</select>
									</div>
									<div className="col-md-6 mb-3">
										<label htmlFor="elegirComuna" className="form-label text-light">Comuna</label>
										<select id="elegirComuna" className="form-select" value={selectedComuna} onChange={e => handleComunaChange(e.target.value)} disabled={!selectedRegion}>
											<option value="">{selectedRegion ? 'Seleccione comuna...' : 'Seleccione una región primero'}</option>
											{comunasOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
										</select>
									</div>
								</div>
	<Modal show={showModal} title="Perfil actualizado" message={modalMsg} onClose={() => setShowModal(false)} />
					<div className="mb-3">
						<label htmlFor="Direccion" className="form-label text-light">Dirección:</label>
						<input type="text" className="form-control" id="Direccion" placeholder="Introduzca una dirección"
							required value={direccion} onChange={e => setDireccion(e.target.value)} />
						<p id="aviso-direccion" className="mt-1 small text-danger">{avisoDireccion}</p>
					</div>
					<div className="mb-3">
						<label htmlFor="fotoUrl" className="form-label">URL de la foto de perfil:</label>
						<input type="text" className="form-control" id="fotoUrl" value={fotoUrl} onChange={e => setFotoUrl(e.target.value)} />
					</div>
					<button type="button" className="btn btn-primary w-100" onClick={handleGuardar}>Guardar cambios</button>
				</form>
			</div>
		</div>
	);
};

export default UserPerfil;

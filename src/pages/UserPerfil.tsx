import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { useRegionesComunas } from '../hooks/RegionesComunas';
import { useModal } from '../hooks/Modal';
import RegionComunaSelects from '../components/RegionComunaSelects';
import { InputWithValidation } from '../components/InputsRegistro';

const UserPerfil: React.FC = () => {
    const [username, setUsername] = useState('');
    const [correo, setCorreo] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [fotoUrl, setFotoUrl] = useState('img/header/user-logo-generic-white-alt.png');
    
    // Estados de validación
    const [errors, setErrors] = useState<{
        username?: string;
        fechaNacimiento?: string;
        telefono?: string;
        direccion?: string;
        region?: string;
        comuna?: string;
    }>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isFormTouched, setIsFormTouched] = useState(false);

    // Usar hook para regiones y comunas
    const {
        regionesOptions,
        comunasOptions,
        selectedRegion,
        selectedComuna,
        handleRegionChange,
        handleComunaChange,
    } = useRegionesComunas('', '');

    // Modal
    const modal = useModal();

    // Cargar datos del usuario al montar
    useEffect(() => {
        try {
            const usuarioActualStr = localStorage.getItem('usuarioActual');
            if (usuarioActualStr) {
                const usuario = JSON.parse(usuarioActualStr);
                setUsername(usuario.username || '');
                setCorreo(usuario.correo || '');
                
                // Formato yyyy-MM-dd para input type date
                if (usuario.fechaNacimiento || usuario.fecha) {
                    const fecha = usuario.fechaNacimiento || usuario.fecha;
                    const fechaISO = fecha.length > 10 ? fecha.slice(0, 10) : fecha;
                    setFechaNacimiento(fechaISO);
                }
                
                setTelefono(usuario.telefono || '');
                // Primero cargar región
                if (usuario.region) {
                    handleRegionChange(usuario.region);
                }
                setDireccion(usuario.direccion || '');
                setFotoUrl(usuario.fotoUrl || 'img/header/user-logo-generic-white-alt.png');
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
        }
    }, []);

    // Cargar comuna después de que las comunas estén disponibles
    useEffect(() => {
        try {
            const usuarioActualStr = localStorage.getItem('usuarioActual');
            if (usuarioActualStr && comunasOptions.length > 0) {
                const usuario = JSON.parse(usuarioActualStr);
                if (usuario.comuna) {
                    handleComunaChange(usuario.comuna);
                }
            }
        } catch (error) {
            console.error('Error al cargar comuna del usuario:', error);
        }
    }, [comunasOptions]); // Se ejecuta cuando comunasOptions cambia

    // Funciones de validación (mismas que en User_Register)
    const validarUsername = (value: string): string => {
        if (!value.trim()) return 'El nombre de usuario es obligatorio.';
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
        if (value.length > 100) return 'El nombre no puede exceder 100 caracteres.';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Solo se permiten letras, números y guion bajo.';
        return '';
    };

    const validarFechaNacimiento = (value: string): string => {
        if (!value) return 'La fecha de nacimiento es obligatoria.';
        
        const fecha = new Date(value);
        const hoy = new Date();
        
        // Calcular edad
        let edad = hoy.getFullYear() - fecha.getFullYear();
        const mes = hoy.getMonth() - fecha.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
            edad--;
        }

        if (edad < 18) return 'Debes ser mayor de 18 años.';
        if (edad > 120) return 'Fecha de nacimiento inválida.';
        if (fecha > hoy) return 'La fecha no puede ser futura.';
        
        return '';
    };

    const validarTelefono = (value: string): string => {
        if (!value.trim()) return ''; // Opcional
        
        // Remover espacios para validación
        const telefonoLimpio = value.replace(/\s/g, '');
        
        // Debe tener entre 8 y 11 dígitos
        if (!/^\d{8,11}$/.test(telefonoLimpio)) {
            return 'El teléfono debe tener entre 8 y 11 dígitos.';
        }
        
        return '';
    };

    const validarDireccion = (value: string): string => {
        if (!value.trim()) return 'La dirección es obligatoria.';
        if (value.length < 5) return 'La dirección debe tener al menos 5 caracteres.';
        if (value.length > 200) return 'La dirección no puede exceder 200 caracteres.';
        return '';
    };

    // Validar todos los campos
    const validarFormulario = () => {
        const nuevosErrores: typeof errors = {};

        const errorUsername = validarUsername(username);
        if (errorUsername) nuevosErrores.username = errorUsername;

        const errorFecha = validarFechaNacimiento(fechaNacimiento);
        if (errorFecha) nuevosErrores.fechaNacimiento = errorFecha;

        const errorTelefono = validarTelefono(telefono);
        if (errorTelefono) nuevosErrores.telefono = errorTelefono;

        const errorDireccion = validarDireccion(direccion);
        if (errorDireccion) nuevosErrores.direccion = errorDireccion;

        if (!selectedRegion) nuevosErrores.region = 'Debes seleccionar una región.';
        if (!selectedComuna) nuevosErrores.comuna = 'Debes seleccionar una comuna.';

        setErrors(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Formatear teléfono automáticamente (igual que en registro)
    const formatearTelefono = (value: string): string => {
        // Eliminar todo excepto números
        const numeros = value.replace(/\D/g, '');
        
        // Formatear según longitud: 9 1234 5678
        if (numeros.length <= 1) return numeros;
        if (numeros.length <= 5) return `${numeros.slice(0, 1)} ${numeros.slice(1)}`;
        return `${numeros.slice(0, 1)} ${numeros.slice(1, 5)} ${numeros.slice(5, 9)}`;
    };

    // Handlers con validación
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setIsFormTouched(true);
        setTouched(prev => ({ ...prev, [name]: true }));

        switch (name) {
            case 'username':
                setUsername(value);
                const errorUsername = validarUsername(value);
                setErrors(prev => ({ ...prev, username: errorUsername || undefined }));
                break;
            case 'fechaNacimiento':
                setFechaNacimiento(value);
                const errorFecha = validarFechaNacimiento(value);
                setErrors(prev => ({ ...prev, fechaNacimiento: errorFecha || undefined }));
                break;
            case 'telefono':
                const telefonoFormateado = formatearTelefono(value);
                setTelefono(telefonoFormateado);
                const errorTelefono = validarTelefono(telefonoFormateado);
                setErrors(prev => ({ ...prev, telefono: errorTelefono || undefined }));
                break;
            case 'direccion':
                setDireccion(value);
                const errorDireccion = validarDireccion(value);
                setErrors(prev => ({ ...prev, direccion: errorDireccion || undefined }));
                break;
        }
    };

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Marcar todos los campos como tocados
        setIsFormTouched(true);
        setTouched({
            username: true,
            fechaNacimiento: true,
            telefono: true,
            direccion: true,
            region: true,
            comuna: true,
        });

        // Validar formulario
        if (!validarFormulario()) {
            modal.showModal(
                'Por favor, corrige los errores antes de guardar.',
                'Errores de Validación'
            );
            return;
        }

        try {
            // Obtener datos actuales del usuario
            const usuarioActualStr = localStorage.getItem('usuarioActual');
            const usuariosStr = localStorage.getItem('usuarios');
            
            if (!usuarioActualStr || !usuariosStr) {
                throw new Error('No se encontraron datos del usuario.');
            }

            const usuarioActual = JSON.parse(usuarioActualStr);
            const usuarios = JSON.parse(usuariosStr);

            // Actualizar datos del usuario PRESERVANDO la contraseña y otros campos
            const usuarioActualizado = {
                ...usuarioActual,  // Mantiene TODOS los campos existentes (incluida contraseña)
                username,
                fechaNacimiento,
                telefono,
                region: selectedRegion,
                comuna: selectedComuna,
                direccion,
                fotoUrl,
                // NO se sobrescribe contraseña, correo, ni otros campos críticos
            };

            // Actualizar en el array de usuarios
            const indexUsuario = usuarios.findIndex((u: any) => u.correo === correo);
            if (indexUsuario !== -1) {
                usuarios[indexUsuario] = usuarioActualizado;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            }

            // Actualizar usuario actual
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));

            modal.showModal(
                'Los cambios se han guardado correctamente.',
                'Perfil Actualizado'
            );
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            modal.showModal(
                'Ocurrió un error al guardar los cambios. Por favor, intenta nuevamente.',
                'Error'
            );
        }
    };

    const getValidationClass = (field: keyof typeof errors): string => {
        if (!isFormTouched || !touched[field]) return '';
        return errors[field] ? 'is-invalid' : 'is-valid';
    };

    const renderMessage = (field: keyof typeof errors): React.ReactNode => {
        if (!isFormTouched || !touched[field]) return null;
        if (errors[field]) {
            return <div className="mt-1 small text-danger">{errors[field]}</div>;
        }
        // Mensajes de éxito opcionales
        if (field === 'username' && username) return <div className="mt-1 small text-success">Nombre de usuario válido</div>;
        if (field === 'fechaNacimiento' && fechaNacimiento) return <div className="mt-1 small text-success">Fecha válida</div>;
        if (field === 'telefono' && telefono) return <div className="mt-1 small text-success">Teléfono válido</div>;
        if (field === 'direccion' && direccion) return <div className="mt-1 small text-success">Dirección válida</div>;
        return null;
    };

    return (
        <div className="container p-5 min-vh-100" style={{ backgroundColor: '#000' }}>
            <h2 className="text-light text-center mb-4">Mi Perfil</h2>
            <div className="card p-4 bg-dark text-light border-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="text-center mb-4">
                    <img 
                        src={fotoUrl} 
                        alt="Foto de perfil" 
                        className="rounded-circle border border-secondary" 
                        width={120} 
                        height={120}
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'img/header/user-logo-generic-white-alt.png';
                        }}
                    />
                </div>

                <form onSubmit={handleGuardar} noValidate>
                    {/* Nombre de usuario */}
                    <InputWithValidation
                        id="username"
                        label="Nombre de usuario:"
                        type="text"
                        name="username"
                        required
                        placeholder="Introduzca un nombre de usuario"
                        maxLength={100}
                        value={username}
                        onChange={handleChange}
                        validationClass={getValidationClass('username')}
                        validationMessage={renderMessage('username')}
                    />

                    {/* Correo (no editable) */}
                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label text-light">Correo:</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="correo" 
                            value={correo} 
                            disabled 
                        />
                        <small className="text-muted">El correo no puede ser modificado.</small>
                    </div>

                    {/* Fecha de Nacimiento */}
                    <InputWithValidation
                        id="fechaNacimiento"
                        label="Fecha de Nacimiento:"
                        type="date"
                        name="fechaNacimiento"
                        required
                        value={fechaNacimiento}
                        onChange={handleChange}
                        validationClass={getValidationClass('fechaNacimiento')}
                        validationMessage={renderMessage('fechaNacimiento')}
                    />

                    {/* Teléfono */}
                    <InputWithValidation
                        id="telefono"
                        label="Teléfono (opcional):"
                        type="text"
                        name="telefono"
                        placeholder="Ej: 9 1234 5678"
                        maxLength={12}
                        value={telefono}
                        onChange={handleChange}
                        validationClass={getValidationClass('telefono')}
                        validationMessage={renderMessage('telefono')}
                    />

                    {/* Región y Comuna */}
                    <RegionComunaSelects
                        currentRegion={selectedRegion}
                        currentComuna={selectedComuna}
                        onRegionChange={(value) => {
                            handleRegionChange(value);
                            setTouched(prev => ({ ...prev, region: true }));
                            setIsFormTouched(true);
                        }}
                        onComunaChange={(value) => {
                            handleComunaChange(value);
                            setTouched(prev => ({ ...prev, comuna: true }));
                            setIsFormTouched(true);
                        }}
                    />

                    {/* Dirección */}
                    <InputWithValidation
                        id="direccion"
                        label="Dirección:"
                        type="text"
                        name="direccion"
                        required
                        placeholder="Introduzca una dirección"
                        maxLength={200}
                        value={direccion}
                        onChange={handleChange}
                        validationClass={getValidationClass('direccion')}
                        validationMessage={renderMessage('direccion')}
                    />

                    {/* URL de foto */}
                    <div className="mb-3">
                        <label htmlFor="fotoUrl" className="form-label text-light">URL de la foto de perfil:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="fotoUrl" 
                            placeholder="https://ejemplo.com/foto.jpg"
                            value={fotoUrl} 
                            onChange={e => setFotoUrl(e.target.value)} 
                        />
                        <small className="text-muted">Deja en blanco para usar la imagen por defecto.</small>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        <i className="bi bi-save me-2"></i>
                        Guardar cambios
                    </button>
                </form>
            </div>

            {/* Modal */}
            <Modal
                show={modal.modalState.show}
                title={modal.modalState.title}
                message={modal.modalState.message}
                onClose={modal.handleClose}
                onHiddenCallback={modal.modalState.onHiddenCallback}
            />
        </div>
    );
};

export default UserPerfil;

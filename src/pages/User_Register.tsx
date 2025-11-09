import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegistroForm, type RegistroFormData } from '../hooks/RegistroForms';
import { useRegionesComunas } from '../hooks/RegionesComunas';
import { useModal } from '../hooks/Modal';
import GlobalModal from '../components/Modal';
import RegionComunaSelects from '../components/RegionComunaSelects';
import { InputWithValidation, PasswordInput } from '../components/InputsRegistro';

/**
 * User_Register.tsx
 * -----------------
 * Página de registro de usuarios.
 * Propósito:
 * - Renderizar el formulario de registro y recopilar los datos del usuario.
 * - Delegar la validación y el manejo del formulario al hook `useRegistroForm`.
 * - Usar `useRegionesComunas` para obtener y manejar selección de región/comuna.
 * - Mostrar mensajes globales mediante el modal proporcionado por `useModal`.
 
 * Notas:
 * - Este componente es principalmente 'composición' de hooks y componentes.
 * - No contiene lógica de validación compleja: la responsabilidad está en `useRegistroForm`.
 * - El modal global se controla mediante `useModal` (hook) y `GlobalModal` (componente).
 *
 */


const UserRegister: React.FC = () => {
  // Hook para controlar el modal global (show/close y callback tras ocultar).
  // `useModal` encapsula el estado del modal y funciones para abrirlo/cerrarlo.
  const modal = useModal();

  // Hook de navegación de react-router para redirecciones (ej: tras registro).
  const navigate = useNavigate();

  // Hook que provee la selección dependiente de región y comuna.
  // - `selectedRegion`, `selectedComuna`: valores actuales.
  // - `handleRegionChange`, `handleComunaChange`: handlers que actualizan la selección.
  const {
    selectedRegion,
    selectedComuna,
    handleRegionChange,
    handleComunaChange,
  } = useRegionesComunas();

  // Hook que encapsula la lógica del formulario de registro:
  // - `formData`: estado del formulario (campos actuales).
  // - `validationMessages`: mensajes de validación por campo.
  // - `isFormTouched`: indica si el usuario interactuó con el formulario.
  // - `handleChange`: manejador para inputs (se pasa a los componentes de input).
  // - `handleSubmit`: manejador final de submit (el hook muestra el modal y realiza redirección).
  const {
    formData,
    validationMessages,
    isFormTouched,
    handleChange,
    handleSubmit,
  } = useRegistroForm(selectedRegion, selectedComuna, modal.showModal, navigate);

  // Estado local de visibilidad de contraseñas para los dos campos del formulario.
  // Mantener la visibilidad por separado permite alternar cada campo.
  const [showPassword, setShowPassword] = useState({
    contrasena: false,
    confirmarContrasena: false,
  });

  // Alterna la visibilidad de la contraseña del campo indicado.
  // - `field` puede ser 'contrasena' o 'confirmarContrasena'.
  const togglePasswordVisibility = (field: 'contrasena' | 'confirmarContrasena') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Renderiza el mensaje de validación (si existe) para un campo concreto.
  // - `fieldId` es la clave del campo en `validationMessages`.
  // - Solo muestra el mensaje si el formulario ha sido tocado (`isFormTouched`).
  const renderMessage = (fieldId: keyof RegistroFormData | 'contrasenaCoincidencia'): React.ReactNode => {
    const messageState = validationMessages[fieldId];
    if (messageState && isFormTouched) {
      return <div className={`mt-1 small ${messageState.className}`}>{messageState.message}</div>;
    }
    return null;
  };

  // Devuelve la clase de validación de Bootstrap para inputs según el estado.
  // - Retorna 'is-invalid' o 'is-valid' según `validationMessages` y si el formulario
  //   fue tocado, o '' si no hay validación para el campo.
  const getValidationClass = (fieldId: keyof RegistroFormData | 'contrasenaCoincidencia'): string => {
    const messageState = validationMessages[fieldId];
    if (messageState && isFormTouched) {
      if (messageState.className === 'text-danger') return 'is-invalid';
      if (messageState.className === 'text-success') return 'is-valid';
    }
    return '';
  };

  // Usar directamente handleSubmit del hook (el hook muestra el modal y hace redirección)
 
   return (
    <div className="container-fluid bg-dark text-white p-5 min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card bg-dark border-0 p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center mb-4 text-light fw-bold">Registro de Usuario</h2>

        <form id="registroForm" onSubmit={handleSubmit} noValidate>
          {/* Correo */}
          <InputWithValidation
            id="correo"
            label="Correo:"
            type="email"
            name="correo"
            required
            placeholder="Introduzca su correo"
            maxLength={100}
            value={formData.correo}
            onChange={handleChange}
            validationClass={getValidationClass('correo')}
            validationMessage={renderMessage('correo')}
          />

          {/* Contraseña */}
          <PasswordInput
            id="contrasena"
            label="Contraseña:"
            name="contrasena"
            required
            placeholder="Ingrese la contraseña"
            maxLength={10}
            value={formData.contrasena}
            onChange={handleChange}
            validationClass={getValidationClass('contrasena')}
            validationMessage={renderMessage('contrasena')}
            show={showPassword.contrasena}
            onToggle={() => togglePasswordVisibility('contrasena')}
          />

          {/* Confirmar contraseña */}
          <PasswordInput
            id="confirmarContrasena"
            label="Confirmar Contraseña:"
            name="confirmarContrasena"
            required
            placeholder="Reingrese la contraseña"
            maxLength={10}
            value={formData.confirmarContrasena}
            onChange={handleChange}
            validationClass={getValidationClass('confirmarContrasena')}
            validationMessage={renderMessage('confirmarContrasena')}
            show={showPassword.confirmarContrasena}
            onToggle={() => togglePasswordVisibility('confirmarContrasena')}
          />

          {/* Nombre de usuario */}
          <InputWithValidation
            id="username"
            label="Nombre de usuario:"
            type="text"
            name="username"
            required
            placeholder="Introduzca un nombre de usuario"
            maxLength={100}
            value={formData.username}
            onChange={handleChange}
            validationClass={getValidationClass('username')}
            validationMessage={renderMessage('username')}
          />

          {/* Fecha de nacimiento */}
          <InputWithValidation
            id="fechaNacimiento"
            label="Fecha de Nacimiento:"
            type="date"
            name="fechaNacimiento"
            required
            value={formData.fechaNacimiento}
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
            value={formData.telefono}
            onChange={handleChange}
            validationClass={getValidationClass('telefono')}
            validationMessage={renderMessage('telefono')}
          />

          {/* Región y comuna */}
          <RegionComunaSelects
            currentRegion={selectedRegion}
            currentComuna={selectedComuna}
            onRegionChange={handleRegionChange}
            onComunaChange={handleComunaChange}
          />

          {/* Dirección */}
          <InputWithValidation
            id="direccion"
            label="Dirección:"
            type="text"
            name="direccion"
            required
            placeholder="Introduzca una dirección"
            value={formData.direccion}
            onChange={handleChange}
            validationClass={getValidationClass('direccion')}
            validationMessage={renderMessage('direccion')}
          />

          {/* Código referido */}
          <InputWithValidation
            id="codigoRef"
            label="Código referido (si posee)"
            type="text"
            name="codigoRef"
            placeholder="Introduzca un código de referido"
            maxLength={10}
            value={(formData as any).codigoRef || ''}
            onChange={handleChange}
            validationClass=""
            validationMessage={null}
          />

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Registrarme
          </button>

          <p className="text-light mt-3 text-center">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-light text-decoration-underline">
              Iniciar sesión
            </Link>
            .
          </p>
        </form>

      </div>

      {/* Modal global */}
      <GlobalModal
        show={modal.modalState.show}
        title={modal.modalState.title}
        message={modal.modalState.message}
        onClose={modal.handleClose}
        onHiddenCallback={modal.modalState.onHiddenCallback}
      />
    </div>
  );
};

export default UserRegister;

/*
  Archivos que importan/enlazan a `UserRegister` y por qué:

  - src/App.tsx
    -> Importa `UserRegister` y lo expone en la ruta `/register` (Route). Es la
       entrada principal para acceder al formulario de registro.

  - src/components/Header.tsx
    -> Contiene un enlace en el menú a `/register` para que los usuarios puedan
       acceder al registro desde la navegación principal.

  - src/components/BannerBienvenida.tsx
    -> Muestra botones/enlaces que llevan a `/register` para invitar al usuario a crear
       una cuenta desde la página de inicio.

  - src/pages/User_Login.tsx
    -> Contiene un enlace a `/register` si el usuario decide registrarse en lugar de
       iniciar sesión.

  - src/hooks/RegistroForms.ts
    -> Hook principal donde se implementa la validación y envío del formulario.
       `UserRegister` lo consume para delegar la lógica.

  - src/hooks/RegionesComunas.ts
    -> Hook que provee la lista de regiones y comunas y handlers; usado para poblar
       `RegionComunaSelects` dentro del formulario.

  - src/components/RegionComunaSelects.tsx
    -> Componente que renderiza los selects de región/comuna; se usa directamente en este formulario.

  - src/components/InputsRegistro.tsx
    -> Contiene `InputWithValidation` y `PasswordInput` usados en el formulario para
       manejar validación y UI de campos.

  Resumen:
  - `UserRegister` es la página de composición del formulario de registro. Enlaza
    con hooks responsables de validación y con componentes UI que muestran los inputs
    y el modal global.
*/

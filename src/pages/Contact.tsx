import React, { useState } from 'react';
import BannerWhatsapp from '../components/BannerWhatsapp';

/*
  Contact.tsx
  -----------------
  Página con un formulario de contacto controlado.


  Resumen rápido:
  - Inputs controlados: nombre, correo y comentario.
  - Validaciones locales (obligatorio, longitud máxima, formato de correo).
  - Simulación de envío (setTimeout) que muestra mensaje de éxito/fracaso.
  - Reutiliza `BannerWhatsapp` al final de la página.


  - `useState` para mantener valores y banderas `touched`.
  - `handleChange` actualiza `form` usando `name` de cada input.
  - `handleBlur` marca el campo como tocado y actualiza errores.
  - `handleSubmit` valida todo el formulario y simula el envío.

*/

type ContactForm = {
  username: string;
  correo: string;
  comentario: string;
};

// Función utilitaria: comprueba formato básico de correo.
const validarEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Contact: React.FC = () => {
  // Estado principal del formulario: guarda los valores de cada campo.
  // Es un objeto con las claves del tipo ContactForm.
  const [form, setForm] = useState<ContactForm>({ username: '', correo: '', comentario: '' });

  // `touched` indica si el usuario ha interactuado (blur) con cada campo.
  // Útil para decidir cuándo mostrar validaciones (evitar mostrar errores antes de que el usuario toque el input).
  const [touched, setTouched] = useState<Record<keyof ContactForm, boolean>>({
    username: false,
    correo: false,
    comentario: false,
  });

  // Mensajes de error por campo. Se actualizan tras validar.
  // Usamos Partial porque puede que no haya error en todos los campos.
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

  // Bandera que indica que estamos en proceso de envío (para deshabilitar el botón y mostrar estado).
  const [enviando, setEnviando] = useState(false);

  // Mensaje global de resultado (éxito o error) que se muestra en un mensaje arriba del formulario.
  const [exito, setExito] = useState<string | null>(null);

  // Límites máximos de caracteres por campo. Centralizarlos facilita cambios futuros.
  const max = { username: 100, correo: 100, comentario: 1000 };

  // Función de validación que recibe los values actuales y devuelve un objeto con errores.
  // No muta estado directamente; devuelve el objeto para ser usado por quien la llame.
  const validar = (values: ContactForm) => {
    const e: Partial<Record<keyof ContactForm, string>> = {};

    // Validación nombre: obligatorio y longitud máxima.
    if (!values.username.trim()) e.username = 'El nombre es obligatorio.';
    else if (values.username.length > max.username) e.username = `Máximo ${max.username} caracteres.`;

    // Validación correo: obligatorio, longitud máxima y formato.
    if (!values.correo.trim()) e.correo = 'El correo es obligatorio.';
    else if (values.correo.length > max.correo) e.correo = `Máximo ${max.correo} caracteres.`;
    else if (!validarEmail(values.correo)) e.correo = 'Formato de correo inválido.';

    // Validación comentario: solo longitud máxima (puede estar vacío).
    if (values.comentario.length > max.comentario) e.comentario = `Máximo ${max.comentario} caracteres.`;

    return e;
  };

  // Handler para actualizar el estado `form` cuando cambian los inputs.
  // También recalcula errores en tiempo real si el campo ya fue 'touched'.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Actualizamos el campo correspondiente manteniendo el resto del formulario.
    setForm(prev => ({ ...prev, [name]: value }));

    // Si el campo ya fue tocado, actualizamos los mensajes de error para reflejar el nuevo valor.
    if (touched[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, ...validar({ ...form, [name]: value }) }));
    }
  };

  // Handler que se ejecuta en blur: marca el campo como tocado y recalcula errores.
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof ContactForm;
    setTouched(prev => ({ ...prev, [name]: true }));
    // Validamos todo el formulario (podríamos validar solo el campo, pero validar todo es simple y suficiente aquí).
    setErrors(validar({ ...form }));
  };

  // Handler del submit: valida, muestra errores si existen y simula envío si todo está bien.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validación completa antes de enviar.
    const validation = validar(form);
    setErrors(validation);
    // Marcamos todos los campos como tocados para que se muestren todos los errores si existen.
    setTouched({ username: true, correo: true, comentario: true });
    // Si hay errores, abortamos el envío.
    if (Object.keys(validation).length > 0) return;

    // Simulamos el envío: se podría reemplazar por fetch/axios a un backend real.
    setEnviando(true);
    setExito(null);
    try {
      // Simulación de latencia / llamada a API
      await new Promise(resolve => setTimeout(resolve, 700));
      // Mensaje de éxito y reseteo del formulario.
      setExito('Mensaje enviado correctamente. Nos contactaremos pronto.');
      setForm({ username: '', correo: '', comentario: '' });
      setTouched({ username: false, correo: false, comentario: false });
      setErrors({});
    } catch {
      // En caso de error en la llamada real, mostrar un mensaje de error genérico.
      setExito('Error al enviar. Intenta nuevamente más tarde.');
    } finally {
      setEnviando(false);
    }
  };

  // JSX: estructura visual del formulario.
  // Notas sobre accesibilidad: cada input tiene `id` y su `label` correspondiente (htmlFor).
  return (
    <div style={{ backgroundColor: 'black' }} className="pb-5">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card bg-dark text-light border-secondary p-3">
              <h3 className="text-light text-center fw-bold mb-3">Formulario de Contacto</h3>
                <h5 className="text-light text-center mb-3">Adjunte sus datos y el motivo del contacto</h5>
              {/* Alert de resultado: se muestra solo si `exito` tiene texto (éxito o error). */}
              {exito && (
                <div className={`alert ${exito.startsWith('Mensaje') ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {exito}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Campo: Nombre */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label text-light">Nombre:</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    // Clases Bootstrap para estados visuales: is-invalid / is-valid según errores/touched
                    className={`form-control ${errors.username ? 'is-invalid' : touched.username ? 'is-valid' : ''}`}
                    placeholder="Introduzca un nombre de usuario"
                    maxLength={max.username}
                    value={form.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={!!errors.username}
                  />
                  <div id="aviso-username" className="form-text small text-danger">
                    {errors.username ?? ''}
                  </div>
                </div>

                {/* Campo: Correo */}
                <div className="mb-3">
                  <label htmlFor="correo" className="form-label text-light">Correo:</label>
                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    className={`form-control ${errors.correo ? 'is-invalid' : touched.correo ? 'is-valid' : ''}`}
                    placeholder="Introduzca su correo"
                    maxLength={max.correo}
                    value={form.correo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={!!errors.correo}
                  />
                  <div id="aviso-correo" className="form-text small text-danger">
                    {errors.correo ?? ''}
                  </div>
                </div>

                {/* Campo: Comentario (textarea) */}
                <div className="mb-3">
                  <label htmlFor="comentario" className="form-label text-light">Comentario:</label>
                  <textarea
                    id="comentario"
                    name="comentario"
                    className={`form-control ${errors.comentario ? 'is-invalid' : touched.comentario ? 'is-valid' : ''}`}
                    rows={4}
                    maxLength={max.comentario}
                    placeholder="Introduzca el motivo de su contacto"
                    value={form.comentario}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.comentario}
                  />
                  {/* Indicador de longitud actual / máxima */}
                  <div className="form-text small text-muted">{form.comentario.length}/{max.comentario}</div>
                  <div id="aviso-comentario" className="form-text small text-danger">
                    {errors.comentario ?? ''}
                  </div>
                </div>

                {/* Botón de envío: deshabilitado mientras `enviando` sea true. */}
                <button type="submit" className="btn btn-azul-electrico w-100" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Componente modularizado */}
      <BannerWhatsapp />
    </div>
  );
};

export default Contact;

/*
  Archivos que importan / usan `Contact` (y por qué):
  - `src/App.tsx`:
      - Monta `Contact` en la ruta `/contacto`. Es la entrada pública a esta página.

  - `src/components/Footer.tsx`:
      - Contiene un `<Link to="/contacto">Contacto</Link>` que permite navegar
        a esta página desde el pie de sitio.

  - `src/components/BannerWhatsapp.tsx`:
      - `Contact` importa y renderiza `BannerWhatsapp` al final. Este componente
        muestra un CTA para contactar por WhatsApp y se reutiliza en otras páginas.

*/
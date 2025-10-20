import React, { useState } from 'react';
import BannerWhatsapp from '../components/BannerWhatsapp';

type ContactForm = {
  username: string;
  correo: string;
  comentario: string;
};

const validarEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactForm>({ username: '', correo: '', comentario: '' });
  const [touched, setTouched] = useState<Record<keyof ContactForm, boolean>>({
    username: false,
    correo: false,
    comentario: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState<string | null>(null);

  const max = { username: 100, correo: 100, comentario: 1000 };

  const validar = (values: ContactForm) => {
    const e: Partial<Record<keyof ContactForm, string>> = {};
    if (!values.username.trim()) e.username = 'El nombre es obligatorio.';
    else if (values.username.length > max.username) e.username = `Máximo ${max.username} caracteres.`;

    if (!values.correo.trim()) e.correo = 'El correo es obligatorio.';
    else if (values.correo.length > max.correo) e.correo = `Máximo ${max.correo} caracteres.`;
    else if (!validarEmail(values.correo)) e.correo = 'Formato de correo inválido.';

    if (values.comentario.length > max.comentario) e.comentario = `Máximo ${max.comentario} caracteres.`;

    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, ...validar({ ...form, [name]: value }) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as keyof ContactForm;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validar({ ...form }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validar(form);
    setErrors(validation);
    setTouched({ username: true, correo: true, comentario: true });
    if (Object.keys(validation).length > 0) return;

    setEnviando(true);
    setExito(null);
    try {
      // Simulación de envío; aquí iría fetch/ajax al backend
      await new Promise(resolve => setTimeout(resolve, 700));
      setExito('Mensaje enviado correctamente. Nos contactaremos pronto.');
      setForm({ username: '', correo: '', comentario: '' });
      setTouched({ username: false, correo: false, comentario: false });
      setErrors({});
    } catch {
      setExito('Error al enviar. Intenta nuevamente más tarde.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'black' }} className="pb-5">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6">
            <div className="card bg-dark text-light border-secondary p-3">
              <h3 className="text-light text-center fw-bold mb-3">Formulario de Contacto</h3>
                <h5 className="text-light text-center mb-3">Adjunte sus datos y el motivo del contacto</h5>
              {exito && (
                <div className={`alert ${exito.startsWith('Mensaje') ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {exito}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label text-light">Nombre:</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
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
                  <div className="form-text small text-muted">{form.comentario.length}/{max.comentario}</div>
                  <div id="aviso-comentario" className="form-text small text-danger">
                    {errors.comentario ?? ''}
                  </div>
                </div>

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
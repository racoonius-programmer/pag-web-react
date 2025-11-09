// src/components/ProductFormModal.tsx
// Componente: ProductFormModal
// - Formulario en modal usado para agregar o editar productos desde el panel admin.
// - Diseño: modal Bootstrap controlado por props (`isOpen`, `onClose`).
// - Este archivo contiene: imports, tipos de props, estado local del formulario,
//   validaciones simples, handlers y el JSX del modal.



import React, { useState, useEffect } from 'react';
import type { Product } from '../types/Product';

// Props que recibe el modal de producto
// - isOpen: controla si el modal se muestra
// - onClose: callback que cierra el modal
// - onSubmit: callback que recibe los datos del producto (sin `codigo`) cuando se envía el formulario
// - product: objeto Product (opcional). Si está presente y mode === 'edit', se carga en el formulario
// - mode: 'add' | 'edit' para distinguir comportamiento y etiquetas
interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, 'codigo'>) => void;
    product?: Product | null; // Para edición
    mode: 'add' | 'edit';
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    product,
    mode
}) => {
    // Estado local del formulario (campo por campo). Es un objeto controlado.
    // Se inicializa vacío para el modo 'add' y se rellenará desde `product` en modo 'edit'.
    const [formData, setFormData] = useState<Omit<Product, 'codigo'>>({
        nombre: '',
        precio: 0,
        categoria: '',
        fabricante: '',
        distribuidor: '',
        Marca: '',
        Material: '',
        Descripcion: '',
        imagen: '',
        enlace: ''
    });

    // Estado para mensajes de error por campo. Llave = nombre del campo, valor = mensaje.
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    // Categorías disponibles (se usan en el select de categoría)
    const categorias = [
        'figuras',
        'juegos_de_mesa',
        'accesorios',
        'consolas',
        'pc_gamer',
        'sillas_gamer',
        'mouse',
        'mousepad',
        'poleras_personalizadas'
    ];

    // Effect: sincroniza el estado del formulario cuando cambian `mode`, `product` o `isOpen`.
    // - En 'edit' copia los valores del `product` al formulario.
    // - En 'add' resetea los campos a valores por defecto.
    // También limpia cualquier mensaje de error al abrir/cerrar o cambiar producto.
    useEffect(() => {
        if (mode === 'edit' && product) {
            setFormData({
                nombre: product.nombre,
                precio: product.precio,
                categoria: product.categoria || '',
                fabricante: product.fabricante || '',
                distribuidor: product.distribuidor || '',
                Marca: product.Marca || '',
                Material: product.Material || '',
                Descripcion: product.Descripcion || '',
                imagen: product.imagen || '',
                enlace: product.enlace || ''
            });
        } else {
            // Resetear formulario para modo agregar
            setFormData({
                nombre: '',
                precio: 0,
                categoria: '',
                fabricante: '',
                distribuidor: '',
                Marca: '',
                Material: '',
                Descripcion: '',
                imagen: '',
                enlace: ''
            });
        }
        setErrors({});
    }, [mode, product, isOpen]);

    // Handler genérico para inputs, textarea y select.
    // Actualiza `formData` por el `name` del elemento y convierte `precio` a número.
    // También limpia el error del campo si existía.
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'precio' ? parseFloat(value) || 0 : value
        }));
        
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validación simple del formulario antes de enviar.
    // Rellena `errors` con mensajes por campo y devuelve true si todo es válido.
    const validarFormulario = () => {
        const errores: Record<string, string> = {};
        
        if (!formData.nombre?.trim()) errores.nombre = 'El nombre es obligatorio';
        if (!formData.precio || formData.precio <= 0) errores.precio = 'El precio debe ser mayor a 0';
        // Imagen opcional, acepta URLs locales (img/...) y URLs completas (http...)
        // En este formulario se exige que la ruta no esté vacía
        if (!formData.imagen?.trim()) {
            errores.imagen = 'La ruta de la imagen es obligatoria';
        }
        
        setErrors(errores);
        return Object.keys(errores).length === 0;
    };

    // Función auxiliar para validar URL
    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Evitar warning de TS por función sin usar (se mantiene para validaciones futuras)
    void isValidUrl;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validarFormulario()) {
            onSubmit(formData);
            onClose();
        }
    };

    const formatCategoria = (categoria: string): string => {
        return categoria.replace(/_/g, ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    if (!isOpen) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {mode === 'add' ? 'Agregar Producto' : 'Editar Producto'}
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={onClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Nombre *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInputChange}
                                    />
                                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                </div>
                                
                                <div className="col-md-6">
                                    <label className="form-label">Precio *</label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.precio ? 'is-invalid' : ''}`}
                                        name="precio"
                                        value={formData.precio}
                                        onChange={handleInputChange}
                                        min="1"
                                        step="any"
                                    />
                                    {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Categoría *</label>
                                    <select
                                        className={`form-select ${errors.categoria ? 'is-invalid' : ''}`}
                                        name="categoria"
                                        value={formData.categoria}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Seleccionar categoría...</option>
                                        {categorias.map(cat => (
                                            <option key={cat} value={cat}>
                                                {formatCategoria(cat)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Fabricante</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fabricante"
                                        value={formData.fabricante}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Distribuidor</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="distribuidor"
                                        value={formData.distribuidor}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Marca</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="Marca"
                                        value={formData.Marca}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Material</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="Material"
                                        value={formData.Material}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">URL de la imagen</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="imagen"
                                        value={formData.imagen}
                                        onChange={handleInputChange}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
                                    {errors.imagen && <div className="invalid-feedback">{errors.imagen}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        name="Descripcion"
                                        value={formData.Descripcion}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Descripción detallada del producto..."
                                    />
                                </div>

                                {formData.imagen && (
                                    <div className="col-12">
                                        <label className="form-label">Vista previa de la imagen</label>
                                        <div className="text-center">
                                            <img 
                                                src={formData.imagen} 
                                                alt="Vista previa"
                                                className="img-thumbnail"
                                                style={{ maxHeight: '200px', maxWidth: '100%' }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                            >
                                {mode === 'add' ? 'Agregar Producto' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductFormModal;

/*
    Archivos que llaman a este componente:
    - src/pages/admin/Admin_Products.tsx
        Aquí se importa y usa <ProductFormModal /> para crear/editar productos desde el panel de admin.

    Resumen rápido de uso:
    - Abrir el modal pasando `isOpen={true}` y `mode` ('add'|'edit').
    - En `onSubmit` recibirás un objeto con los campos del producto (sin `codigo`) y deberías
        persistirlo en tu fuente de datos (localStorage, servidor, etc.).
*/
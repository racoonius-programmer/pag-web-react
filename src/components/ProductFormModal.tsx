// src/components/ProductFormModal.tsx
import React, { useState, useEffect } from 'react';
import type { Product } from '../types/Product';

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

    const [errors, setErrors] = useState<{[key: string]: string}>({});

    // Categorías disponibles
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

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }
        if (formData.precio <= 0) {
            newErrors.precio = 'El precio debe ser mayor a 0';
        }
        if (!formData.categoria) {
            newErrors.categoria = 'La categoría es obligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
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
                                        step="1000"
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
                                        type="url"
                                        className="form-control"
                                        name="imagen"
                                        value={formData.imagen}
                                        onChange={handleInputChange}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />
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
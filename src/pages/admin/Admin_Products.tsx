// src/pages/admin/Admin_Products.tsx
import React, { useState } from 'react';
import type { Product } from '../../types/Product';
import { useProducts } from '../../hooks/UseProducts';
import ProductFormModal from '../../components/ProductFormModal';
import Modal from '../../components/Modal';
import { useModal } from '../../hooks/Modal';

const Admin_Products: React.FC = () => {
    const { productos, addProduct, updateProduct, deleteProduct, cloneProduct } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterPriceRange, setFilterPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
    
    // Estados para el modal de formulario
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    // Estados para modales de confirmación y mensajes
    const { modalState, showModal, handleClose } = useModal();
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const formatCategoria = (categoria: string): string => {
        return categoria.replace(/_/g, ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const getUniqueCategories = () => {
        const categories = new Set(productos.map(p => p.categoria).filter(Boolean));
        return Array.from(categories);
    };

    const filteredProducts = productos.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (product.fabricante && product.fabricante.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = filterCategory === 'all' || product.categoria === filterCategory;
        
        let matchesPrice = true;
        if (filterPriceRange === 'low') matchesPrice = product.precio <= 50000;
        else if (filterPriceRange === 'medium') matchesPrice = product.precio > 50000 && product.precio <= 200000;
        else if (filterPriceRange === 'high') matchesPrice = product.precio > 200000;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const getPriceRangeColor = (precio: number) => {
        if (precio <= 50000) return 'success';
        if (precio <= 200000) return 'warning';
        return 'danger';
    };

    const getProductStats = () => {
        const stats = {
            total: productos.length,
            categories: getUniqueCategories().length,
            avgPrice: productos.length > 0 ? Math.round(productos.reduce((sum, p) => sum + p.precio, 0) / productos.length) : 0,
            maxPrice: productos.length > 0 ? Math.max(...productos.map(p => p.precio)) : 0,
            minPrice: productos.length > 0 ? Math.min(...productos.map(p => p.precio)) : 0
        };
        return stats;
    };

    const handleAddProduct = () => {
        setModalMode('add');
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setModalMode('edit');
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleCloneProduct = (codigo: string) => {
        const cloned = cloneProduct(codigo);
        if (cloned) {
            showModal(
                `Producto "${cloned.nombre}" clonado exitosamente con código "${cloned.codigo}"`,
                'Producto Clonado'
            );
        } else {
            showModal('Error al clonar el producto. Por favor, intenta nuevamente.', 'Error');
        }
    };

    const handleDeleteProduct = (codigo: string, nombre: string) => {
        setConfirmModal({
            show: true,
            title: 'Confirmar Eliminación',
            message: `¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`,
            onConfirm: () => {
                deleteProduct(codigo);
                if (selectedProduct && selectedProduct.codigo === codigo) {
                    setSelectedProduct(null);
                }
                setConfirmModal({ show: false, title: '', message: '', onConfirm: () => {} });
                showModal(`Producto "${nombre}" eliminado exitosamente`, 'Producto Eliminado');
            }
        });
    };

    const handleModalSubmit = (productData: Omit<Product, 'codigo'>) => {
        if (modalMode === 'add') {
            const newProduct = addProduct(productData);
            showModal(
                `Producto "${newProduct.nombre}" agregado exitosamente con código "${newProduct.codigo}"`,
                'Producto Agregado'
            );
        } else if (modalMode === 'edit' && productToEdit) {
            updateProduct(productToEdit.codigo, productData);
            showModal(
                `Producto "${productData.nombre}" actualizado exitosamente`,
                'Producto Actualizado'
            );
            if (selectedProduct && selectedProduct.codigo === productToEdit.codigo) {
                setSelectedProduct({ ...productToEdit, ...productData });
            }
        }
    };

    const stats = getProductStats();

    return (
        <div className="p-4">
            <div className="row g-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="text-white">Gestión de Productos</h1>
                        <div className="d-flex gap-2">
                            <span className="badge bg-primary fs-6">
                                {filteredProducts.length} productos
                            </span>
                            <button 
                                className="btn btn-success btn-sm"
                                onClick={handleAddProduct}
                            >
                                <i className="bi bi-plus-lg me-1"></i>
                                Agregar Producto
                            </button>
                        </div>
                    </div>
                </div>

                {/* Estadísticas rápidas */}
                <div className="col-12">
                    <div className="row g-3 mb-4">
                        <div className="col-md-2">
                            <div className="card bg-primary text-white text-center">
                                <div className="card-body py-2">
                                    <h6 className="mb-0">Total</h6>
                                    <h4 className="mb-0">{stats.total}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card bg-info text-white text-center">
                                <div className="card-body py-2">
                                    <h6 className="mb-0">Categorías</h6>
                                    <h4 className="mb-0">{stats.categories}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="card bg-success text-white text-center">
                                <div className="card-body py-2">
                                    <h6 className="mb-0">Precio Promedio</h6>
                                    <small className="mb-0">${stats.avgPrice.toLocaleString('es-ES')}</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card bg-warning text-white text-center">
                                <div className="card-body py-2">
                                    <h6 className="mb-0">Rango de Precios</h6>
                                    <small className="mb-0">${stats.minPrice.toLocaleString('es-ES')} - ${stats.maxPrice.toLocaleString('es-ES')}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros y búsqueda */}
                <div className="col-12">
                    <div className="card bg-dark text-white mb-4">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Buscar producto</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nombre, código o fabricante..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Filtrar por categoría</label>
                                    <select
                                        className="form-select"
                                        value={filterCategory}
                                        onChange={(e) => setFilterCategory(e.target.value)}
                                    >
                                        <option value="all">Todas las categorías</option>
                                        {getUniqueCategories().map(category => (
                                            <option key={category} value={category}>
                                                {category ? formatCategoria(category) : 'Sin categoría'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Filtrar por precio</label>
                                    <select
                                        className="form-select"
                                        value={filterPriceRange}
                                        onChange={(e) => setFilterPriceRange(e.target.value as any)}
                                    >
                                        <option value="all">Todos los precios</option>
                                        <option value="low">Bajo (≤ $50.000)</option>
                                        <option value="medium">Medio ($50.001 - $200.000)</option>
                                        <option value="high">Alto (&gt; $200.000)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-8">
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            <h5 className="mb-0">Lista de Productos</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-dark table-hover">
                                    <thead>
                                        <tr>
                                            <th>Imagen</th>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Precio</th>
                                            <th>Categoría</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(producto => (
                                            <tr key={producto.codigo}>
                                                <td>
                                                    <img 
                                                        src={producto.imagen} 
                                                        alt={producto.nombre}
                                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                        className="rounded"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/img/productos/default-product.png';
                                                        }}
                                                    />
                                                </td>
                                                <td>{producto.codigo}</td>
                                                <td>{producto.nombre}</td>
                                                <td>
                                                    <span className={`badge bg-${getPriceRangeColor(producto.precio)}`}>
                                                        ${producto.precio?.toLocaleString('es-ES')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {producto.categoria ? formatCategoria(producto.categoria) : 'Sin categoría'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group" role="group">
                                                        <button 
                                                            className="btn btn-sm btn-outline-info"
                                                            onClick={() => setSelectedProduct(producto)}
                                                            title="Ver detalles"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-warning"
                                                            onClick={() => handleEditProduct(producto)}
                                                            title="Editar producto"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-success"
                                                            onClick={() => handleCloneProduct(producto.codigo)}
                                                            title="Duplicar producto"
                                                        >
                                                            <i className="bi bi-files"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteProduct(producto.codigo, producto.nombre)}
                                                            title="Eliminar producto"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredProducts.length === 0 && (
                                    <div className="text-center text-muted py-4">
                                        No se encontraron productos que coincidan con los filtros.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel de detalles del producto */}
                <div className="col-lg-4">
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            <h5 className="mb-0">Detalles del Producto</h5>
                        </div>
                        <div className="card-body">
                            {selectedProduct ? (
                                <div>
                                    {selectedProduct.imagen && (
                                        <div className="text-center mb-3">
                                            <img 
                                                src={selectedProduct.imagen} 
                                                alt={selectedProduct.nombre}
                                                className="img-fluid rounded"
                                                style={{ maxHeight: '200px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="row g-2">
                                        <div className="col-12">
                                            <strong>Código:</strong> 
                                            <span className="badge bg-secondary ms-2">{selectedProduct.codigo}</span>
                                        </div>
                                        <div className="col-12">
                                            <strong>Nombre:</strong> {selectedProduct.nombre}
                                        </div>
                                        <div className="col-12">
                                            <strong>Precio:</strong> 
                                            <span className={`badge bg-${getPriceRangeColor(selectedProduct.precio)} ms-2`}>
                                                ${selectedProduct.precio?.toLocaleString('es-ES')}
                                            </span>
                                        </div>
                                        <div className="col-12">
                                            <strong>Categoría:</strong> 
                                            <span className="badge bg-info ms-2">
                                                {selectedProduct.categoria ? formatCategoria(selectedProduct.categoria) : 'Sin categoría'}
                                            </span>
                                        </div>
                                        <div className="col-12">
                                            <strong>Fabricante:</strong> {selectedProduct.fabricante || 'N/A'}
                                        </div>
                                        <div className="col-12">
                                            <strong>Distribuidor:</strong> {selectedProduct.distribuidor || 'N/A'}
                                        </div>
                                        <div className="col-12">
                                            <strong>Marca:</strong> {selectedProduct.Marca || 'N/A'}
                                        </div>
                                        <div className="col-12">
                                            <strong>Material:</strong> {selectedProduct.Material || 'N/A'}
                                        </div>
                                        {selectedProduct.Descripcion && (
                                            <div className="col-12">
                                                <strong>Descripción:</strong>
                                                <p className="text-muted mt-1 small">{selectedProduct.Descripcion}</p>
                                            </div>
                                        )}
                                    </div>

                                    <hr />
                                    
                                    <div className="d-grid gap-2">
                                        <button 
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={() => handleEditProduct(selectedProduct)}
                                        >
                                            <i className="bi bi-pencil me-1"></i>
                                            Editar Producto
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => handleCloneProduct(selectedProduct.codigo)}
                                        >
                                            <i className="bi bi-files me-1"></i>
                                            Duplicar Producto
                                        </button>
                                        <button className="btn btn-sm btn-outline-info">
                                            <i className="bi bi-eye me-1"></i>
                                            Ver en Tienda
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteProduct(selectedProduct.codigo, selectedProduct.nombre)}
                                        >
                                            <i className="bi bi-trash me-1"></i>
                                            Eliminar Producto
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted py-5">
                                    <i className="bi bi-box-seam fs-1 d-block mb-3"></i>
                                    <p>Selecciona un producto para ver sus detalles</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para agregar/editar productos */}
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                product={productToEdit}
                mode={modalMode}
            />

            {/* Modal de mensajes (éxito/error) */}
            <Modal
                show={modalState.show}
                title={modalState.title}
                message={modalState.message}
                onClose={handleClose}
                onHiddenCallback={modalState.onHiddenCallback}
            />

            {/* Modal de confirmación */}
            {confirmModal.show && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{confirmModal.title}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: () => {} })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>{confirmModal.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setConfirmModal({ show: false, title: '', message: '', onConfirm: () => {} })}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick={confirmModal.onConfirm}
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin_Products;
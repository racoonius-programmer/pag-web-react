// src/pages/admin/Admin_Users.tsx
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/User';
import { UsuarioService, type UsuarioPayload } from '../../services/usuario.service';
import { PedidoService } from '../../services/pedido.service';
import StickyContainer from '../../components/StickyContainer';
import Modal from '../../components/Modal';
import { useModal } from '../../hooks/Modal';

/*
  Funcionalidad principal:
  - Carga la lista de usuarios desde la API.
  - Permite buscar y filtrar por rol y por si tienen descuento DUOC.
  - Permite acciones de administración: ver detalles, asignar/quitar rol admin,
    activar/desactivar descuento DUOC y eliminar usuarios.
  - Validación: no permite eliminar usuarios con pedidos activos.
  - Usa modales en lugar de alerts para mejor UX.

  Notas:
    Las actualizaciones se envían a la API para persistencia.
*/
const Admin_Users: React.FC = () => {
    // Lista completa de usuarios (estado local)
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Usuario actualmente seleccionado en el panel de detalles
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

    // Estados para búsqueda y filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'usuario'>('all');
    const [filterDuoc, setFilterDuoc] = useState<'all' | 'si' | 'no'>('all');

    // Modal principal para mensajes informativos
    const { modalState, showModal, handleClose } = useModal();

    // Modal de confirmación para eliminaciones
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
        cancelText?: string;
        type?: 'danger' | 'warning' | 'info';
    }>({
        show: false,
        title: '',
        message: '',
        onConfirm: () => {},
        confirmText: 'Confirmar',
        cancelText: 'Cancelar',
        type: 'danger'
    });

    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsers();
    }, []);

    // Carga usuarios desde la API y actualiza el estado
    const loadUsers = async () => {
        try {
            setLoading(true);
            const usuariosList = await UsuarioService.listar();
            setUsuarios(usuariosList);
            setError(null);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    };

    // Elimina un usuario (con confirmación modal y validación de pedidos activos)
    const deleteUser = async (userId: number) => {
        try {
            // Verificar si el usuario tiene pedidos activos
            const tienePedidosActivos = await PedidoService.usuarioTienePedidosActivos(userId);
            
            if (tienePedidosActivos) {
                // Obtener información detallada de los pedidos activos
                const pedidosActivos = await PedidoService.obtenerPedidosActivosUsuario(userId);
                const cantidadPedidos = pedidosActivos.length;
                const usuario = usuarios.find(u => u.id === userId);
                
                showModal(
                    `No se puede eliminar el usuario "${usuario?.username}" porque tiene ${cantidadPedidos} pedido(s) activo(s) en preparación.\n\nPrimero debe completar o cancelar todos sus pedidos pendientes.`,
                    'No se puede eliminar el usuario'
                );
                return;
            }

            // Si no tiene pedidos activos, mostrar confirmación
            const usuario = usuarios.find(u => u.id === userId);
            setConfirmModal({
                show: true,
                title: 'Confirmar Eliminación',
                message: `¿Estás seguro de que quieres eliminar al usuario "${usuario?.username}"?\n\nEsta acción no se puede deshacer y se perderán todos los datos del usuario.`,
                confirmText: 'Eliminar Usuario',
                cancelText: 'Cancelar',
                type: 'danger',
                onConfirm: async () => {
                    try {
                        await UsuarioService.eliminar(userId);
                        const updatedUsers = usuarios.filter(u => u.id !== userId);
                        setUsuarios(updatedUsers);
                        setSelectedUser(null);
                        setConfirmModal({ ...confirmModal, show: false });
                        showModal(
                            `El usuario "${usuario?.username}" ha sido eliminado exitosamente.`,
                            'Usuario Eliminado'
                        );
                    } catch (err) {
                        console.error('Error al eliminar usuario:', err);
                        setConfirmModal({ ...confirmModal, show: false });
                        showModal(
                            'Ocurrió un error al eliminar el usuario. Por favor, intenta nuevamente.',
                            'Error al eliminar'
                        );
                    }
                }
            });
        } catch (err) {
            console.error('Error al verificar pedidos del usuario:', err);
            showModal(
                'Error al verificar los pedidos del usuario. Por favor, intenta nuevamente.',
                'Error de verificación'
            );
        }
    };

    // Alterna el rol entre 'admin' y 'usuario'
    const toggleUserRole = async (userId: number) => {
        const usuario = usuarios.find(u => u.id === userId);
        if (!usuario) return;

        try {
            const nuevoRol = usuario.rol === 'admin' ? 'usuario' : 'admin';
            const usuarioActualizado: UsuarioPayload = {
                username: usuario.username,
                correo: usuario.correo,
                contrasena: usuario.contrasena,
                fechaNacimiento: usuario.fechaNacimiento,
                telefono: usuario.telefono,
                direccion: usuario.direccion,
                region: usuario.region,
                comuna: usuario.comuna,
                rol: nuevoRol,
                descuentoDuoc: usuario.descuentoDuoc,
                fotoPerfil: usuario.fotoPerfil
            };

            const usuarioResponse = await UsuarioService.actualizar(userId, usuarioActualizado);
            
            const updatedUsers = usuarios.map(user => 
                user.id === userId ? usuarioResponse : user
            );
            setUsuarios(updatedUsers);
            
            // Actualizar usuario seleccionado si es el mismo
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(usuarioResponse);
            }

            showModal(
                `El rol del usuario "${usuario.username}" ha sido cambiado a "${nuevoRol}" exitosamente.`,
                'Rol Actualizado'
            );
        } catch (err) {
            console.error('Error al actualizar rol de usuario:', err);
            showModal(
                'Error al actualizar el rol del usuario. Por favor, intenta nuevamente.',
                'Error al actualizar rol'
            );
        }
    };

    // Alterna el flag `descuentoDuoc` para un usuario
    const toggleDuocDiscount = async (userId: number) => {
        const usuario = usuarios.find(u => u.id === userId);
        if (!usuario) return;

        try {
            const usuarioActualizado: UsuarioPayload = {
                username: usuario.username,
                correo: usuario.correo,
                contrasena: usuario.contrasena,
                fechaNacimiento: usuario.fechaNacimiento,
                telefono: usuario.telefono,
                direccion: usuario.direccion,
                region: usuario.region,
                comuna: usuario.comuna,
                rol: usuario.rol,
                descuentoDuoc: !usuario.descuentoDuoc,
                fotoPerfil: usuario.fotoPerfil
            };

            const usuarioResponse = await UsuarioService.actualizar(userId, usuarioActualizado);
            
            const updatedUsers = usuarios.map(user => 
                user.id === userId ? usuarioResponse : user
            );
            setUsuarios(updatedUsers);
            
            // Actualizar usuario seleccionado si es el mismo
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(usuarioResponse);
            }

            const accion = usuario.descuentoDuoc ? 'desactivado' : 'activado';
            showModal(
                `El descuento DUOC para "${usuario.username}" ha sido ${accion} exitosamente.`,
                'Descuento DUOC Actualizado'
            );
        } catch (err) {
            console.error('Error al actualizar descuento DUOC:', err);
            showModal(
                'Error al actualizar el descuento DUOC. Por favor, intenta nuevamente.',
                'Error al actualizar descuento'
            );
        }
    };

    // Filtrado combinado: búsqueda por username/email + rol + descuento DUOC
    const filteredUsers = usuarios.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.correo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.rol === filterRole;
        const matchesDuoc = filterDuoc === 'all' || 
                           (filterDuoc === 'si' && user.descuentoDuoc) ||
                           (filterDuoc === 'no' && !user.descuentoDuoc);
        
        return matchesSearch && matchesRole && matchesDuoc;
    });

    return (
        <StickyContainer>
            <div className="row g-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="text-white">Gestión de Usuarios</h1>
                        <div className="d-flex gap-2">
                            <span className="badge bg-primary fs-6">
                                {filteredUsers.length} usuarios
                            </span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="col-12">
                        <div className="alert alert-info">Cargando usuarios...</div>
                    </div>
                ) : error ? (
                    <div className="col-12">
                        <div className="alert alert-danger">
                            {error}
                            <button 
                                className="btn btn-sm btn-outline-light ms-2"
                                onClick={loadUsers}
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Filtros y búsqueda */}
                        <div className="col-12">
                            <div className="card bg-dark text-white mb-4">
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Buscar usuario</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Username o email..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Filtrar por rol</label>
                                            <select
                                                className="form-select"
                                                value={filterRole}
                                                onChange={(e) => setFilterRole(e.target.value as any)}
                                            >
                                                <option value="all">Todos los roles</option>
                                                <option value="admin">Administradores</option>
                                                <option value="usuario">Usuarios</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Filtrar por DUOC</label>
                                            <select
                                                className="form-select"
                                                value={filterDuoc}
                                                onChange={(e) => setFilterDuoc(e.target.value as any)}
                                            >
                                                <option value="all">Todos</option>
                                                <option value="si">Con descuento DUOC</option>
                                                <option value="no">Sin descuento DUOC</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-lg-8">
                            <div className="card bg-dark text-white">
                                <div className="card-header">
                                    <h5 className="mb-0">Lista de Usuarios</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-dark table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Username</th>
                                                    <th>Email</th>
                                                    <th>Rol</th>
                                                    <th>DUOC</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.map(usuario => (
                                                    <tr key={usuario.id}>
                                                        <td>{usuario.id}</td>
                                                        <td>{usuario.username}</td>
                                                        <td>{usuario.correo}</td>
                                                        <td>
                                                            <span className={`badge ${usuario.rol === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                                                {usuario.rol}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${usuario.descuentoDuoc ? 'bg-success' : 'bg-secondary'}`}>
                                                                {usuario.descuentoDuoc ? 'Sí' : 'No'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="btn-group" role="group">
                                                                <button 
                                                                    className="btn btn-sm btn-outline-info"
                                                                    onClick={() => setSelectedUser(usuario)}
                                                                    title="Ver detalles"
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm btn-outline-warning"
                                                                    onClick={() => toggleUserRole(usuario.id)}
                                                                    title={`Cambiar a ${usuario.rol === 'admin' ? 'usuario' : 'admin'}`}
                                                                >
                                                                    <i className="bi bi-person-gear"></i>
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm btn-outline-success"
                                                                    onClick={() => toggleDuocDiscount(usuario.id)}
                                                                    title={`${usuario.descuentoDuoc ? 'Quitar' : 'Activar'} descuento DUOC`}
                                                                >
                                                                    <i className="bi bi-mortarboard"></i>
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => deleteUser(usuario.id)}
                                                                    title="Eliminar usuario"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredUsers.length === 0 && (
                                            <div className="text-center text-white py-4">
                                                No se encontraron usuarios que coincidan con los filtros.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel de detalles del usuario */}
                        <div className="col-lg-4">
                            <div className="card bg-dark text-white">
                                <div className="card-header">
                                    <h5 className="mb-0">Detalles del Usuario</h5>
                                </div>
                                <div className="card-body">
                                    {selectedUser ? (
                                        <div>
                                            <div className="text-center mb-3">
                                                <img 
                                                    src={selectedUser.fotoPerfil || '/img/header/user-logo-generic-white-alt.png'} 
                                                    alt="Foto de perfil"
                                                    className="rounded-circle"
                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                />
                                                <h6 className="mt-2">{selectedUser.username}</h6>
                                            </div>
                                            
                                            <div className="row g-2">
                                                <div className="col-12">
                                                    <strong>ID:</strong> {selectedUser.id}
                                                </div>
                                                <div className="col-12">
                                                    <strong>Email:</strong> {selectedUser.correo}
                                                </div>
                                                <div className="col-12">
                                                    <strong>Teléfono:</strong> {selectedUser.telefono}
                                                </div>
                                                <div className="col-12">
                                                    <strong>Dirección:</strong> {selectedUser.direccion}
                                                </div>
                                                <div className="col-12">
                                                    <strong>Región:</strong> {selectedUser.region}
                                                </div>
                                                <div className="col-12">
                                                    <strong>Comuna:</strong> {selectedUser.comuna}
                                                </div>
                                                <div className="col-12">
                                                    <strong>Fecha Nacimiento:</strong> {selectedUser.fechaNacimiento}
                                                </div>
                                                <div className="col-12">
                                                    <strong>Rol:</strong> 
                                                    <span className={`badge ms-2 ${selectedUser.rol === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                                                        {selectedUser.rol}
                                                    </span>
                                                </div>
                                                <div className="col-12">
                                                    <strong>Descuento DUOC:</strong> 
                                                    <span className={`badge ms-2 ${selectedUser.descuentoDuoc ? 'bg-success' : 'bg-secondary'}`}>
                                                        {selectedUser.descuentoDuoc ? 'Activado' : 'Desactivado'}
                                                    </span>
                                                </div>
                                            </div>

                                            <hr />
                                            
                                            <div className="d-grid gap-2">
                                                <button 
                                                    className={`btn btn-sm ${selectedUser.rol === 'admin' ? 'btn-warning' : 'btn-success'}`}
                                                    onClick={() => toggleUserRole(selectedUser.id)}
                                                >
                                                    {selectedUser.rol === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                                                </button>
                                                <button 
                                                    className={`btn btn-sm ${selectedUser.descuentoDuoc ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                    onClick={() => toggleDuocDiscount(selectedUser.id)}
                                                >
                                                    {selectedUser.descuentoDuoc ? 'Quitar DUOC' : 'Activar DUOC'}
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteUser(selectedUser.id)}
                                                >
                                                    Eliminar Usuario
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-white py-5">
                                            <i className="bi bi-person-circle fs-1 d-block mb-3"></i>
                                            <p>Selecciona un usuario para ver sus detalles</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal principal para mensajes informativos */}
            <Modal
                show={modalState.show}
                title={modalState.title}
                message={modalState.message}
                onClose={handleClose}
                onHiddenCallback={modalState.onHiddenCallback}
            />

            {/* Modal de confirmación personalizado */}
            {confirmModal.show && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-light border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title text-light">
                                    <i className={`bi bi-${confirmModal.type === 'danger' ? 'exclamation-triangle' : 'question-circle'} me-2`}></i>
                                    {confirmModal.title}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-light" style={{ whiteSpace: 'pre-line' }}>
                                    {confirmModal.message}
                                </p>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                                >
                                    {confirmModal.cancelText}
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn btn-${confirmModal.type === 'danger' ? 'danger' : 'primary'}`}
                                    onClick={confirmModal.onConfirm}
                                >
                                    <i className={`bi bi-${confirmModal.type === 'danger' ? 'trash' : 'check'} me-1`}></i>
                                    {confirmModal.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </StickyContainer>
    );
};

export default Admin_Users;
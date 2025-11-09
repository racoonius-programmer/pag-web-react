// src/pages/admin/Admin_Users.tsx
import React, { useState, useEffect } from 'react';
import type { Usuario } from '../../types/User';

/*
  Funcionalidad principal:
  - Carga la lista de usuarios desde localStorage (clave 'usuarios').
  - Permite buscar y filtrar por rol y por si tienen descuento DUOC.
  - Permite acciones de administración: ver detalles, asignar/quitar rol admin,
    activar/desactivar descuento DUOC y eliminar usuarios.

  Notas:
    Las actualizaciones se guardan en localStorage para persistencia entre sesiones
    durante el desarrollo.
*/
const Admin_Users: React.FC = () => {
    // Lista completa de usuarios (estado local)
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    // Usuario actualmente seleccionado en el panel de detalles
    const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

    // Estados para búsqueda y filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'usuario'>('all');
    const [filterDuoc, setFilterDuoc] = useState<'all' | 'si' | 'no'>('all');

    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsers();
    }, []);

    // Lee 'usuarios' desde localStorage y actualiza el estado
    const loadUsers = () => {
        const usuariosJSON = localStorage.getItem("usuarios");
        const usuariosList: Usuario[] = usuariosJSON ? JSON.parse(usuariosJSON) : [];
        setUsuarios(usuariosList);
    };

    // Elimina un usuario (con confirmación browser)
    // Actualiza localStorage y limpia la selección si era el borrado
    const deleteUser = (userId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            const updatedUsers = usuarios.filter(u => u.id !== userId);
            setUsuarios(updatedUsers);
            localStorage.setItem("usuarios", JSON.stringify(updatedUsers));
            setSelectedUser(null);
        }
    };

    // Alterna el rol entre 'admin' y 'usuario'
    // Actualiza localStorage y el usuario seleccionado si aplica
    const toggleUserRole = (userId: number) => {
        const updatedUsers = usuarios.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    rol: user.rol === 'admin' ? 'usuario' as const : 'admin' as const
                };
            }
            return user;
        });
        setUsuarios(updatedUsers);
        localStorage.setItem("usuarios", JSON.stringify(updatedUsers));
        
        // Actualizar usuario seleccionado si es el mismo
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(updatedUsers.find(u => u.id === userId) || null);
        }
    };

    // Alterna el flag `descuentoDuoc` para un usuario
    // Igual que el anterior, actualiza estado y persistencia
    const toggleDuocDiscount = (userId: number) => {
        const updatedUsers = usuarios.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    descuentoDuoc: !user.descuentoDuoc
                };
            }
            return user;
        });
        setUsuarios(updatedUsers);
        localStorage.setItem("usuarios", JSON.stringify(updatedUsers));
        
        // Actualizar usuario seleccionado si es el mismo
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(updatedUsers.find(u => u.id === userId) || null);
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

    // -----------------
    // JSX: la estructura visual
    // - columna izquierda: lista y acciones
    // - columna derecha: detalles del usuario seleccionado
    // -----------------
    return (
        <div className="p-4">
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
                                    <div className="text-center text-muted py-4">
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
                                <div className="text-center text-muted py-5">
                                    <i className="bi bi-person-circle fs-1 d-block mb-3"></i>
                                    <p>Selecciona un usuario para ver sus detalles</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin_Users;

/*
  Dónde se importa / usa este componente `Admin_Users`:
  - src/App.tsx
    * Importa `Admin_Users` y lo monta en la ruta del área administrativa:  
      `<Route path="users" element={<Admin_Users />} />` dentro de la ruta `/admin`.
    * Por qué: es la entrada principal para la gestión de usuarios desde el panel admin.

  - src/pages/admin/Admin_Layout.tsx
    * No lo importa directamente, pero el layout (sidebar) incluye la navegación que
      permite acceder a `/admin/users`.
    * Por qué: el layout centraliza la navegación del admin y permite que `Admin_Users`
      se muestre dentro del mismo contenedor (Outlet) compartido.
*/
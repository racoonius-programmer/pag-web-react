// src/pages/Admin_Inicio.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin_Inicio: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirigir automáticamente al dashboard del admin
        navigate('/admin');
    }, [navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#121212' }}>
            <div className="text-center text-white">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Redirigiendo al panel de administración...</p>
            </div>
        </div>
    );
};

export default Admin_Inicio;
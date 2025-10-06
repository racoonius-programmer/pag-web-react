// src/components/PasswordInput.tsx

import React, { useState, useCallback, type ChangeEventHandler } from 'react';


interface PasswordInputProps {
    id: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    placeholder: string;
    maxLength?: number;
    label: string;
    // Opcional: para usar en formularios como el de registro donde la validación es visual
    aviso?: React.ReactNode; 
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    id,
    value,
    onChange,
    placeholder,
    maxLength,
    label,
    aviso,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    return (
        <div className="mb-3 position-relative">
            <label htmlFor={id} className="form-label text-light">
                {label}:
            </label>
            <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id={id}
                name={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                required
            />
            
            {/* Ícono de alternancia */}
            <i
                className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} toggle-password`}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '38px',
                    cursor: 'pointer',
                    color: 'black',
                }}
                onClick={togglePasswordVisibility}
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            ></i>
            
            {/* Aviso de validación (si se proporciona) */}
            {aviso}
        </div>
    );
};

export default PasswordInput;
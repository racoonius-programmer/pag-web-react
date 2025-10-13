import React, { useMemo } from 'react';
import ProductoCard from './ProductCard';
import type { Product } from '../types/Product';
// ⚠️ Importar el tipo de usuario (asumiendo que está disponible)
import type { Usuario } from '../types/User'; 

// Importa la base de datos de productos (asumiendo que está en data/)
import productosDB from '../data/productos.json';

// ⚠️ CÓDIGO AÑADIDO: Función auxiliar para obtener el usuario
const getUsuarioDB = (): Usuario | null => {
    const usuariosJSON = localStorage.getItem("usuarios");
    const usuarios: Usuario[] = usuariosJSON ? JSON.parse(usuariosJSON) : [];

    const usuarioActualRaw = localStorage.getItem("usuarioActual");
    if (!usuarioActualRaw) return null;

    // usuarioActual puede ser "username" o un JSON stringificado del objeto usuario.
    let usernameActual: string | null = null;
    try {
      const parsed = JSON.parse(usuarioActualRaw);
      if (parsed && typeof parsed === 'object' && parsed.username) usernameActual = parsed.username;
      else if (typeof parsed === 'string') usernameActual = parsed;
    } catch {
      // no es JSON, tratar como username plano
      usernameActual = usuarioActualRaw;
    }

    if (!usernameActual) return null;
    return usuarios.find(u => u.username === usernameActual) || null;
};

const ProductosDestacados: React.FC = () => {
    
    // ⚠️ Lógica para obtener el estado de descuento del usuario
    const usuarioLogueado = useMemo(getUsuarioDB, []);
    const esDuoc = !!(usuarioLogueado && usuarioLogueado.descuentoDuoc === true);
    
    // 1. Lógica para seleccionar 3 productos al azar (Migrada desde Vanilla JS)
    const productosSeleccionados = useMemo(() => {
        const productos: Product[] = productosDB as Product[];

        // Si la lista está vacía, no hagas nada
        if (productos.length === 0) {
            return [];
        }
        
        // Simulación: toma 3 al azar
        const seleccion = productos
            // 1. Clona el array para no modificar el original
            .slice() 
            // 2. Ordena aleatoriamente
            .sort(() => 0.5 - Math.random())
            // 3. Toma los primeros 3
            .slice(0, 3);
            
        return seleccion;
    }, []); // Se ejecuta una sola vez al montar el componente

    return (
        <div data-bs-theme="dark">
            <br />
            <h1 style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '10px' }} className="text-light">
                Lo más vendido
            </h1>
            <div className="container py-5">
                {productosSeleccionados.length > 0 ? (
                    <div className="d-flex flex-row justify-content-center overflow-auto gap-4 px-2" id="mas-vendidos" style={{scrollSnapType:'x mandatory'}}>
                        {productosSeleccionados.map(producto => (
                            <div style={{ minWidth: '320px', scrollSnapAlign:'start', margin: '0 auto' }} key={producto.codigo}>
                                {/* ⚠️ CAMBIO PRINCIPAL: Pasar la prop 'esDuoc' al ProductoCard */}
                                <ProductoCard producto={producto} esDuoc={esDuoc} /> 
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-center text-muted'>No hay productos disponibles para mostrar.</p>
                )}
            </div>
        </div>
    );
};

export default ProductosDestacados;
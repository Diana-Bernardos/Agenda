

// src/components/ListaColecciones.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../Services/api.js';
import '../Styles/Card.css';

const ListaColecciones = () => {
  const [colecciones, setColecciones] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const cargarColecciones = async () => {
      try {
        const response = await api.getColecciones();
        setColecciones(response.data);
      } catch (err) {
        setError('Error al cargar colecciones');
        console.error(err);
      }
    };

    cargarColecciones();
  }, []);
  const coleccionesFiltradas = colecciones.filter(coleccion => 
    coleccion.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    coleccion.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );


  if (error) return <div>Error: {error}</div>;

  return (
    <div className="lista-colecciones">
      <div className="header-actions">

        <h2>Colecciones</h2>
        <input
         type="text"
         placeholder="Buscar colecciones..."
         value={filtro}
         onChange={(e) => setFiltro(e.target.value)}
         className="search-input"
       />
       <button onClick={() => navigate('/colecciones/nueva')}>
         Nueva Colección
       </button>
     </div>
     <div className="colecciones-grid">
       {coleccionesFiltradas.map(coleccion => (
         <div key={coleccion.id} className="coleccion-card">
           <h3>{coleccion.nombre}</h3>
           <p>{coleccion.descripcion}</p>
           <div className="card-actions">
             <button onClick={() => navigate(`/colecciones/${coleccion.id}`)}>
               Ver
             </button>
           </div>
         </div>
       ))}
     </div>
   </div>
  );
};

export default ListaColecciones;
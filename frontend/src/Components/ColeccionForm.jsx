

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../Services/api.js';
import '../Styles/Form.css';


const ColeccionForm = ({ coleccion: coleccionInicial, modo = 'crear' }) => {
  const navigate = useNavigate();
  const [coleccion, setColeccion] = useState(coleccionInicial || {
    nombre: '',
    descripcion: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modo === 'crear') {
        await api.crearColeccion(coleccion);
      } else {
        await api.actualizarColeccion(coleccionInicial.id, coleccion);
      }
      navigate('/colecciones');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la solicitud');
    }
  };

  return (
    <div className="form-container">
      <h2>{modo === 'crear' ? 'Nueva Colección' : 'Editar Colección'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            className="form-control"
            value={coleccion.nombre}
            onChange={(e) => setColeccion({...coleccion, nombre: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            className="form-control"
            value={coleccion.descripcion}
            onChange={(e) => setColeccion({...coleccion, descripcion: e.target.value})}
            rows={4}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {modo === 'crear' ? 'Crear' : 'Actualizar'}
          </button>
          <button 
            type="button" 
            className="btn"
            onClick={() => navigate('/colecciones')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColeccionForm;
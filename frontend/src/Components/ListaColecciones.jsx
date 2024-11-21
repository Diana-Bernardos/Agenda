

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Card.css';

const ListaColecciones = () => {
  const [colecciones, setColecciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarColecciones();
  }, []);

  const cargarColecciones = async () => {
    try {
      const response = await api.getColecciones();
      setColecciones(response.data);
    } catch (error) {
      console.error('Error al cargar colecciones:', error);
    }
  };

  const eliminarColeccion = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta colección?')) {
      try {
        await api.eliminarColeccion(id);
        await cargarColecciones();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  return (
    <div>
      <div className="header-actions">
        <h2>Colecciones</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/colecciones/nueva')}
        >
          Nueva Colección
        </button>
      </div>
      <div className="card-grid">
        {colecciones.map(coleccion => (
          <div key={coleccion.id} className="card">
            <h3 className="card-title">{coleccion.nombre}</h3>
            <p className="card-content">{coleccion.descripcion}</p>
            <div className="card-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/colecciones/${coleccion.id}`)}
              >
                Ver Personas
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => eliminarColeccion(coleccion.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaColecciones;
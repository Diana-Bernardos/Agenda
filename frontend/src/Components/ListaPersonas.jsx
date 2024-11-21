

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Card.css';

const ListaPersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPersonas();
  }, []);

  const cargarPersonas = async () => {
    try {
      const response = await api.getPersonas();
      setPersonas(response.data);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar personas:', error);
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta persona?')) {
      try {
        await api.eliminarPersona(id);
        await cargarPersonas();
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('No se pudo eliminar la persona');
      }
    }
  };

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="lista-container">
      <div className="header-actions">
        <h2>Personas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/personas/nueva')}
        >
          Nueva Persona
        </button>
      </div>

      <div className="card-grid">
        {personas.map(persona => (
          <div key={persona.id} className="card">
            <h3 className="card-title">{persona.nombre} {persona.apellido}</h3>
            <div className="card-content">
              <p><strong>Email:</strong> {persona.email}</p>
              <p><strong>Teléfono:</strong> {persona.telefono}</p>
              
              {persona.direccion && (
                <div className="direccion-info">
                  <h4>Dirección:</h4>
                  <p>{persona.direccion.calle} {persona.direccion.numero}</p>
                  <p>{persona.direccion.ciudad}, {persona.direccion.codigo_postal}</p>
                  <p>{persona.direccion.pais}</p>
                </div>
              )}
            </div>
            
            <div className="card-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/personas/editar/${persona.id}`)}
              >
                Editar
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleEliminar(persona.id)}
              >
                Eliminar
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate(`/personas/${persona.id}/colecciones`)}
              >
                Ver Colecciones
              </button>
            </div>
          </div>
        ))}
      </div>

      {personas.length === 0 && (
        <p className="no-data">No hay personas registradas</p>
      )}
    </div>
  );
};

export default ListaPersonas;
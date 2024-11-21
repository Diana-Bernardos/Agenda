

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../Services/api.js';
import '../Styles/Card.css';

const ListaPersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');
  const navigate = useNavigate();



  useEffect(() => {
    cargarPersonas();
  }, []);

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getPersonas();
      setPersonas(response.data);
    } catch (error) {
      console.error('Error al cargar personas:', error);
      setError('Error al cargar las personas');
    } finally {
      setLoading(false);
    }
  };
  const personasFiltradas = personas.filter(persona => 
    persona.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    persona.apellido.toLowerCase().includes(filtro.toLowerCase()) ||
    persona.email.toLowerCase().includes(filtro.toLowerCase())
  );

  


  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta persona?')) {
      try {
        await api.eliminarPersona(id);
        await cargarPersonas(); // Recargar la lista
        alert('Persona eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar la persona');
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={cargarPersonas} className="btn btn-primary">
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="lista-container">
      <div className="header-actions">
        <h2>Contactos</h2>
        <input
          type="text"
          placeholder="Buscar personas..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="search-input"
        />
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/personas/nueva')}
        >
          Nuevo contacto 
        </button>
      </div>
   
      {personas.length === 0 ? (
        <p className="no-data">No hay personas registradas</p>
      ) : (
        <div className="card-grid">
          {personasFiltradas.map(persona => (
            <div key={persona.id} className="card">
              <h3 className="card-title">
                {persona.nombre} {persona.apellido}
              </h3>
              <div className="card-content">
                <p><strong>Email:</strong> {persona.email}</p>
                <p><strong>Teléfono:</strong> {persona.telefono}</p>
                {persona.direccion && (
                  <div className="direccion-info">
                    <h4>Dirección:</h4>
                    <p>{persona.direccion.calle} {persona.direccion.numero}</p>
                    <p>{persona.direccion.ciudad}, {persona.direccion.codigoPostal}</p>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
   );}

   export default ListaPersonas;
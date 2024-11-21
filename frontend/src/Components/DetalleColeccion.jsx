

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Card.css';

const DetalleColeccion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coleccion, setColeccion] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [personasDisponibles, setPersonasDisponibles] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [coleccionRes, personasRes] = await Promise.all([
        api.getColeccion(id),
        api.getPersonas()
      ]);
      setColeccion(coleccionRes.data);
      setPersonas(coleccionRes.data.personas || []);
      setPersonasDisponibles(personasRes.data.filter(
        p => !coleccionRes.data.personas?.some(cp => cp.id === p.id)
      ));
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const agregarPersona = async () => {
    if (!selectedPersona) return;
    try {
      await api.agregarPersonaAColeccion(selectedPersona, id);
      await cargarDatos();
      setSelectedPersona('');
    } catch (error) {
      console.error('Error al agregar persona:', error);
    }
  };

  const quitarPersona = async (personaId) => {
    try {
      await api.quitarPersonaDeColeccion(personaId, id);
      await cargarDatos();
    } catch (error) {
      console.error('Error al quitar persona:', error);
    }
  };

  if (!coleccion) return <div>Cargando...</div>;

  return (
    <div className="coleccion-detalle">
      <h2>{coleccion.nombre}</h2>
      <p>{coleccion.descripcion}</p>

      <div className="agregar-persona">
        <select 
          value={selectedPersona}
          onChange={(e) => setSelectedPersona(e.target.value)}
          className="form-control"
        >
          <option value="">Seleccionar persona</option>
          {personasDisponibles.map(p => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellido}
            </option>
          ))}
        </select>
        <button 
          className="btn btn-primary"
          onClick={agregarPersona}
        >
          Agregar a la colección
        </button>
      </div>

      <div className="card-grid">
        {personas.map(persona => (
          <div key={persona.id} className="card">
            <h3 className="card-title">
              {persona.nombre} {persona.apellido}
            </h3>
            <p className="card-content">{persona.email}</p>
            <div className="card-actions">
              <button 
                className="btn btn-danger"
                onClick={() => quitarPersona(persona.id)}
              >
                Quitar de la colección
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetalleColeccion;
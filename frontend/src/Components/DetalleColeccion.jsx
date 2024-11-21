

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../Services/api.js';
import '../Styles/Card.css';

const DetalleColeccion = () => {
  const { id } = useParams();
  const [coleccion, setColeccion] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [todasLasPersonas, setTodasLasPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');
  

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [coleccionRes, personasRes, todasRes] = await Promise.all([
        api.getColeccion(id),
        api.getPersonasDeColeccion(id),
        api.getPersonas()
      ]);
      
      setColeccion(coleccionRes.data);
      setPersonas(personasRes.data);
      setTodasLasPersonas(todasRes.data);
    } catch (error) {
      console.error('Error:', error);
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
    <div className="p-4">
      <h2 className="text-2xl mb-4">{coleccion.nombre}</h2>
      <p className="mb-4">{coleccion.descripcion}</p>
 
      <div className="mb-4">
        <h3 className="text-xl mb-2">Agregar Persona</h3>
        <select 
          value={selectedPersona} 
          onChange={(e) => setSelectedPersona(e.target.value)}
          className="mr-2 p-2 border rounded"
        >
          <option value="">Seleccionar persona...</option>
          {todasLasPersonas
            .filter(p => !personas.find(pp => pp.id === p.id))
            .map(persona => (
              <option key={persona.id} value={persona.id}>
                {persona.nombre} {persona.apellido}
              </option>
            ))}
        </select>
        <button 
          onClick={agregarPersona}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </div>
 
      <div>
        <h3 className="text-xl mb-2">Personas en esta colección</h3>
        <div className="grid gap-4">
          {personas.map(persona => (
            <div key={persona.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <p className="font-bold">{persona.nombre} {persona.apellido}</p>
                <p>{persona.email}</p>
              </div>
              <button 
                onClick={() => quitarPersona(persona.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
 };
 
 export default DetalleColeccion;
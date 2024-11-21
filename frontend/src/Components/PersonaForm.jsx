

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/Form.css';

const PersonaForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cargando, setCargando] = useState(id ? true : false);
  const [persona, setPersona] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: {
      calle: '',
      numero: '',
      ciudad: '',
      codigo_postal: '',
      pais: ''
    }
  });

  useEffect(() => {
    if (id) {
      cargarPersona();
    }
  }, [id]);

  const cargarPersona = async () => {
    try {
      const response = await api.getPersona(id);
      setPersona({
        ...response.data,
        direccion: response.data.direccion || {
          calle: '',
          numero: '',
          ciudad: '',
          codigo_postal: '',
          pais: ''
        }
      });
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar persona:', error);
      alert('Error al cargar los datos de la persona');
      navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('direccion.')) {
      const campo = name.split('.')[1];
      setPersona(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [campo]: value
        }
      }));
    } else {
      setPersona(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.actualizarPersona(id, persona);
      } else {
        await api.crearPersona(persona);
      }
      navigate('/');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los datos');
    }
  };

  if (cargando) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="form-container">
      <h2>{id ? 'Editar Persona' : 'Nueva Persona'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Datos Personales</h3>
          
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              value={persona.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido:</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              className="form-control"
              value={persona.apellido}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              className="form-control"
              value={persona.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={persona.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Dirección</h3>
          
          <div className="form-group">
            <label htmlFor="calle">Calle:</label>
            <input
              type="text"
              id="calle"
              name="direccion.calle"
              className="form-control"
              value={persona.direccion.calle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="numero">Número:</label>
            <input
              type="text"
              id="numero"
              name="direccion.numero"
              className="form-control"
              value={persona.direccion.numero}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ciudad">Ciudad:</label>
            <input
              type="text"
              id="ciudad"
              name="direccion.ciudad"
              className="form-control"
              value={persona.direccion.ciudad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigo_postal">Código Postal:</label>
            <input
              type="text"
              id="codigo_postal"
              name="direccion.codigo_postal"
              className="form-control"
              value={persona.direccion.codigo_postal}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pais">País:</label>
            <input
              type="text"
              id="pais"
              name="direccion.pais"
              className="form-control"
              value={persona.direccion.pais}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {id ? 'Actualizar' : 'Crear'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonaForm;

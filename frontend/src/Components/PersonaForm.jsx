

/// src/Components/PersonaForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../Services/api.js';
import '../Styles/Form.css';

const PersonaForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    direccion: {
      calle: '',
      numero: '',
      ciudad: '',
      codigoPostal: '',
      pais: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('direccion.')) {
      const campo = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [campo]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.crearPersona(formData);
      console.log('Persona creada:', response.data);
      alert('Persona guardada exitosamente');
      navigate('/');
    } catch (error) {
      console.error('Error al guardar:', error);
      setError('Error al guardar la persona. Por favor, intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Nueva Contacto</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <h3>Dirección</h3>
        
        <div className="form-group">
          <label htmlFor="calle">Calle:</label>
          <input
            type="text"
            id="calle"
            name="direccion.calle"
            value={formData.direccion.calle}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="numero">Número:</label>
          <input
            type="text"
            id="numero"
            name="direccion.numero"
            value={formData.direccion.numero}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ciudad">Ciudad:</label>
          <input
            type="text"
            id="ciudad"
            name="direccion.ciudad"
            value={formData.direccion.ciudad}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="codigoPostal">Código Postal:</label>
          <input
            type="text"
            id="codigoPostal"
            name="direccion.codigoPostal"
            value={formData.direccion.codigoPostal}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pais">País:</label>
          <input
            type="text"
            id="pais"
            name="direccion.pais"
            value={formData.direccion.pais}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonaForm;
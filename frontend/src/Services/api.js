
import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const api = {
  // Personas
  getPersonas: () => axios.get(`${API_URL}/personas`),
  getPersona: (id) => axios.get(`${API_URL}/personas/${id}`),
  crearPersona: (persona) => axios.post(`${API_URL}/personas`, persona),
  actualizarPersona: (id, persona) => axios.put(`${API_URL}/personas/${id}`, persona),
  eliminarPersona: (id) => axios.delete(`${API_URL}/personas/${id}`),

  // Colecciones
  getColecciones: () => axios.get(`${API_URL}/colecciones`),
  getColeccion: (id) => axios.get(`${API_URL}/colecciones/${id}`),
  crearColeccion: (coleccion) => axios.post(`${API_URL}/colecciones`, coleccion),
  actualizarColeccion: (id, coleccion) => axios.put(`${API_URL}/colecciones/${id}`, coleccion),
  eliminarColeccion: (id) => axios.delete(`${API_URL}/colecciones/${id}`),

  // Relaciones
  agregarPersonaAColeccion: (personaId, coleccionId) => 
    axios.post(`${API_URL}/colecciones/${coleccionId}/personas/${personaId}`),
  quitarPersonaDeColeccion: (personaId, coleccionId) => 
    axios.delete(`${API_URL}/colecciones/${coleccionId}/personas/${personaId}`)
};
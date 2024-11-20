const PersonaModel = require('../models/persona.model');
const DireccionModel = require('../models/direccion.model');

class PersonaController {
  static async crear(req, res) {
    try {
      // Primero crear la dirección
      const direccionId = await DireccionModel.crear(req.body.direccion);
      
      // Crear la persona con la referencia a la dirección
      const persona = {
        ...req.body,
        direccionId
      };
      
      const personaId = await PersonaModel.crear(persona);
      const nuevaPersona = await PersonaModel.obtenerPorId(personaId);
      
      res.status(201).json(nuevaPersona);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async obtenerTodos(req, res) {
    try {
      const personas = await PersonaModel.obtenerTodos();
      res.json(personas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PersonaController;

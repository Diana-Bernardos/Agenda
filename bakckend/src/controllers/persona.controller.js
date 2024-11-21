const PersonaModel = require('../models/persona.model');

class PersonaController {
  static async crear(req, res) {
    try {
      const { nombre, apellido, telefono, email, direccion } = req.body;
      const id = await PersonaModel.crear({ nombre, apellido, telefono, email }, direccion);
      res.status(201).json({ id, mensaje: 'Persona creada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
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

  static async obtenerPorId(req, res) {
    try {
      const persona = await PersonaModel.obtenerPorId(req.params.id);
      if (!persona) {
        return res.status(404).json({ mensaje: 'Persona no encontrada' });
      }
      res.json(persona);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const { nombre, apellido, telefono, email, direccion } = req.body;
      await PersonaModel.actualizar(
        req.params.id,
        { nombre, apellido, telefono, email },
        direccion
      );
      res.json({ mensaje: 'Persona actualizada exitosamente' });
    } catch (error) {
      if (error.message === 'Persona no encontrada') {
        return res.status(404).json({ mensaje: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      await PersonaModel.eliminar(req.params.id);
      res.json({ mensaje: 'Persona eliminada exitosamente' });
    } catch (error) {
      if (error.message === 'Persona no encontrada') {
        return res.status(404).json({ mensaje: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PersonaController;
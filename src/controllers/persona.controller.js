const PersonaModel = require('../models/persona.model');
const DireccionModel = require('../models/direccion.model');

const pool = require('../config/database');

const PersonaController = {
  crear: async (req, res) => {
    try {
      const { nombre, apellido, telefono, email, direccion } = req.body;
      
      // Create the address record first
      const [addressResult] = await pool.query(`
        INSERT INTO direcciones (calle, numero, ciudad, codigo_postal, pais)
        VALUES (?, ?, ?, ?, ?)
      `, [direccion.calle, direccion.numero, direccion.ciudad, direccion.codigoPostal, direccion.pais]);
      
      const direccionId = addressResult.insertId;
      
      // Create the persona record
      const [personaResult] = await pool.query(`
        INSERT INTO personas (nombre, apellido, telefono, email, direccion_id)
        VALUES (?, ?, ?, ?, ?)
      `, [nombre, apellido, telefono, email, direccionId]);
      
      res.status(201).json({ id: personaResult.insertId });
    } catch (error) {
      console.error('Error creating persona:', error);
      res.status(500).json({ error: 'Error creating persona' });
    }
  },
  
  obtenerTodos: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM personas');
      res.json(rows);
    } catch (error) {
      console.error('Error retrieving personas:', error);
      res.status(500).json({ error: 'Error retrieving personas' });
    }
  }
};

module.exports = PersonaController;
